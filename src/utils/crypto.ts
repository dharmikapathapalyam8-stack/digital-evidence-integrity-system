/**
 * Computes a SHA-256 hex string from an ArrayBuffer using Web Crypto API
 */
export async function computeBufferSha256(buffer: ArrayBuffer): Promise<string> {
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
}

/**
 * Computes a SHA-256 hex string from a string
 */
export async function computeStringSha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  return computeBufferSha256(data.buffer);
}

/**
 * Generates an Evidence DNA alphanumeric fingerprint (e.g., '7F9A-22B8-91AC')
 * based on the file hash and metadata
 */
export function generateEvidenceDna(sha256: string): string {
  if (!sha256 || sha256.length < 12) {
    return 'E7A1-49F2-C08B';
  }
  const clean = sha256.replace(/[^A-Fa-f0-9]/g, '').toUpperCase();
  const part1 = clean.substring(0, 4) || '7F9A';
  const part2 = clean.substring(4, 8) || '22B8';
  const part3 = clean.substring(8, 12) || '91AC';
  return `${part1}-${part2}-${part3}`;
}

/**
 * Generates an altered DNA string when tampering is simulated
 */
export function generateTamperedDna(originalDna: string): string {
  const segments = originalDna.split('-');
  if (segments.length < 3) return 'B7C2-99D1-44E8';
  
  // Flip characters deterministically to show divergence
  const flipped1 = 'B7C2';
  const flipped2 = (parseInt(segments[1], 16) ^ 0x55AA).toString(16).toUpperCase().padStart(4, '0');
  const flipped3 = 'FF90';
  return `${flipped1}-${flipped2.substring(0, 4)}-${flipped3}`;
}

/**
 * Generates a pseudo QR verification matrix (10x10 grid) deterministically from a hash
 */
export function generateVerificationMatrix(hash: string): boolean[][] {
  const size = 10;
  const grid: boolean[][] = [];
  const cleanHash = (hash + 'FEDCBA9876543210FEDCBA9876543210').replace(/[^a-fA-F0-9]/g, '');

  for (let r = 0; r < size; r++) {
    const row: boolean[] = [];
    for (let c = 0; c < size; c++) {
      // Corner alignment markers
      if ((r <= 2 && c <= 2) || (r <= 2 && c >= 7) || (r >= 7 && c <= 2)) {
        if ((r === 1 && c === 1) || (r === 1 && c === 8) || (r === 8 && c === 1)) {
          row.push(false);
        } else {
          row.push(true);
        }
      } else {
        const charIdx = (r * size + c) % cleanHash.length;
        const val = parseInt(cleanHash[charIdx] || '8', 16);
        row.push(val % 2 === 0);
      }
    }
    grid.push(row);
  }
  return grid;
}

/**
 * Truncates a 64-char hash for display: A8F4C29B...92BC
 */
export function truncateHash(hash: string, start = 8, end = 4): string {
  if (!hash || hash.length <= start + end) return hash || 'N/A';
  return `${hash.substring(0, start)}...${hash.substring(hash.length - end)}`;
}

/**
 * Formats byte size to human readable MB/GB/KB
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
