// per-book motion ported from the book club engine: springs, the out-turn-in choreography and flights

import * as THREE from "three";
import { BOOKS } from "../shared/shelf-model";

export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export interface PoseLike {
  pos: THREE.Vector3;
  quat: THREE.Quaternion;
}

export interface Tween {
  from: PoseLike;
  to: () => PoseLike; // re-read every frame so a moving target is tracked
  t: number;
  dur: number;
  pullStart: number; // cm the book slides towards the reader before turning
  pullEnd: number; // cm it comes in straight at the end
  ease?: (t: number) => number;
  done?: () => void;
}

// a pose change done in three phases: pull clear of the shelf, turn, set down
export interface Choreo {
  from: THREE.Vector3;
  fromQ: THREE.Quaternion;
  t: number;
  dur: number;
  zc: number;
  yc: number;
}

export interface BookState {
  id: string;
  mesh: THREE.Mesh;
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  quat: THREE.Quaternion;
  tPos: THREE.Vector3; // where the layout wants it
  tQuat: THREE.Quaternion;
  follow: boolean; // carried, follows the pointer close
  stiff: boolean; // which spring the carried book uses
  offShelf: boolean;
  inHand: boolean; // flown out to the close-up
  choreo: Choreo | null;
  flight: Tween | null;
}

// position on a cubic bezier with straight pull-out and pull-in legs, rotation lagging a touch
export function tweenPose(tw: Tween, t: number) {
  const ease = tw.ease ?? easeInOut;
  const e = ease(t);
  const to = tw.to();
  const p0 = tw.from.pos;
  const p1 = p0.clone().add(new THREE.Vector3(0, 0, tw.pullStart));
  const p3 = to.pos;
  const p2 = p3.clone().add(new THREE.Vector3(0, 0, tw.pullEnd));
  const u = 1 - e;
  const pos = p0
    .clone()
    .multiplyScalar(u * u * u)
    .addScaledVector(p1, 3 * u * u * e)
    .addScaledVector(p2, 3 * u * e * e)
    .addScaledVector(p3, e * e * e);
  const rStart = tw.pullStart > 0 ? 0.06 : 0;
  const rEnd = tw.pullEnd > 0 ? 0.88 : 1;
  const rt = ease(THREE.MathUtils.clamp((t - rStart) / (rEnd - rStart), 0, 1));
  const quat = new THREE.Quaternion().slerpQuaternions(tw.from.quat, to.quat, rt);
  return { pos, quat };
}

// z where a book's centre is far enough forward to turn in front of the shelf
export function clearZ(id: string) {
  const b = BOOKS[id];
  return 1.2 + Math.sqrt(b.h * b.h + b.d * b.d + b.t * b.t) / 2;
}

const PH_OUT = 0.26;
const PH_IN = 0.72;

export function startChoreo(s: BookState, floorY: number | null, dur: number) {
  const b = BOOKS[s.id];
  const zc = clearZ(s.id);
  // only a real turn gets lifted, a book carried without turning goes straight to its spot
  const turning = s.quat.angleTo(s.tQuat) > 0.7;
  const floor = floorY ?? s.tPos.y - b.h / 2;
  const yc = turning ? floor + Math.max(b.h, b.d) / 2 + 0.6 : -Infinity;
  // a dropped book is already held clear so it skips the pull-out phase
  const t0 = s.pos.z >= zc - 0.5 ? PH_OUT : 0;
  s.choreo = { from: s.pos.clone(), fromQ: s.quat.clone(), t: t0, dur, zc, yc };
  s.vel.set(0, 0, 0);
}

// returns true while the book is still moving
export function stepBook(s: BookState, dt: number, pull: THREE.Vector3): boolean {
  if (s.flight) stepFlight(s, dt);
  else if (s.choreo) stepChoreo(s, dt, pull);
  else if (!stepSpring(s, dt, pull)) {
    sync(s);
    return false;
  }
  sync(s);
  return true;
}

export function sync(s: BookState) {
  s.mesh.position.copy(s.pos);
  s.mesh.quaternion.copy(s.quat);
}

export function place(s: BookState, pos: THREE.Vector3, quat: THREE.Quaternion) {
  s.pos.copy(pos);
  s.quat.copy(quat);
  s.vel.set(0, 0, 0);
  s.choreo = null;
  sync(s);
}

function stepFlight(s: BookState, dt: number) {
  const f = s.flight!;
  f.t = Math.min(1, f.t + dt / f.dur);
  const P = tweenPose(f, f.t);
  s.pos.copy(P.pos);
  s.quat.copy(P.quat);
  if (f.t >= 1) {
    s.flight = null;
    s.vel.set(0, 0, 0);
    f.done?.();
  }
}

function stepChoreo(s: BookState, dt: number, target: THREE.Vector3) {
  const c = s.choreo!;
  c.t = Math.min(1, c.t + dt / c.dur);
  // waypoints: straight out of the slot, clear of everything, then straight in
  const a = new THREE.Vector3(c.from.x, Math.max(c.from.y, c.yc), c.zc);
  const b = new THREE.Vector3(target.x, Math.max(target.y, c.yc), c.zc);
  const ph = THREE.MathUtils.smoothstep;
  let turn = 0;
  if (c.t < PH_OUT) s.pos.lerpVectors(c.from, a, ph(c.t, 0, PH_OUT));
  else if (c.t < PH_IN) {
    turn = ph(c.t, PH_OUT, PH_IN);
    s.pos.lerpVectors(a, b, turn);
  } else {
    turn = 1;
    s.pos.lerpVectors(b, target, ph(c.t, PH_IN, 1));
  }
  s.quat.slerpQuaternions(c.fromQ, s.tQuat, turn);
  if (c.t >= 1) s.choreo = null;
}

// critically damped while carried, a touch springy otherwise, returns false once settled
function stepSpring(s: BookState, dt: number, pull: THREE.Vector3): boolean {
  const held = s.follow && s.stiff;
  const k = held ? 900 : 190;
  const c = held ? 2 * Math.sqrt(k) : 2 * Math.sqrt(k) * 0.78;
  // fixed 1/240 s sub-steps keep the semi-implicit spring stable through a dropped frame
  const n = Math.max(1, Math.ceil(dt * 240));
  const h = dt / n;
  for (let i = 0; i < n; i++) {
    s.vel.x += ((pull.x - s.pos.x) * k - s.vel.x * c) * h;
    s.vel.y += ((pull.y - s.pos.y) * k - s.vel.y * c) * h;
    s.vel.z += ((pull.z - s.pos.z) * k - s.vel.z * c) * h;
    s.pos.addScaledVector(s.vel, h);
  }
  s.quat.slerp(s.tQuat, 1 - Math.exp(-(held ? 22 : 11) * dt));
  const settled =
    s.pos.distanceToSquared(pull) < 1e-4 && s.vel.lengthSq() < 1e-3 && s.quat.angleTo(s.tQuat) < 1e-3;
  if (!settled) return true;
  s.pos.copy(pull);
  s.vel.set(0, 0, 0);
  s.quat.copy(s.tQuat);
  return false;
}
