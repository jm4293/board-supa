/**
 * 날짜 문자열을 한국어 형식으로 포맷팅
 * @param dateString - ISO 형식의 날짜 문자열
 * @returns 포맷팅된 날짜 문자열 (예: "2024년 1월 15일 오후 3:30")
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * 텍스트를 지정된 길이로 자르고 말줄임표 추가
 * @param content - 자를 텍스트
 * @param maxLength - 최대 길이 (기본값: 100)
 * @returns 잘린 텍스트 또는 원본 텍스트
 */
export function truncateContent(content: string, maxLength: number = 100): string {
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength) + '...';
}

