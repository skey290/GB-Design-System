// Firebase 연결 전까지의 임시 저장소 — 모듈 레벨 상태라 같은 탭 안에서만 유지되고, 추후 Firebase 호출로 손쉽게 교체 가능하다.
const archivedImagesBySelfId = new Map<string, string[]>();

export function addArchivedImage(selfId: string, src: string): void {
  const existing = archivedImagesBySelfId.get(selfId) ?? [];
  archivedImagesBySelfId.set(selfId, [...existing, src]);
}

export function getArchivedImages(selfId: string): string[] {
  return archivedImagesBySelfId.get(selfId) ?? [];
}

export function clearArchivedImages(selfId: string): void {
  archivedImagesBySelfId.delete(selfId);
}
