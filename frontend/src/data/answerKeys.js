// 자료 출처: 사용자가 첨부한 2027학년도 9월 모의평가 국어 정답표 이미지 2장
// 공통 1~34번은 동일하고, 선택과목 35~45번은 별도 정답을 사용함.
const answerKeys = {
  '2027학년도|9월|korean|화법과 작문': [4, 1, 4, 5, 4, 2, 1, 3, 1, 2, 5, 3, 1, 2, 3, 4, 5, 4, 5, 4, 2, 1, 1, 2, 3, 3, 1, 1, 3, 2, 3, 5, 5, 4, 4, 5, 5, 4, 3, 2, 1, 2, 3, 2, 5],
  '2027학년도|9월|korean|언어와 매체': [4, 1, 4, 5, 4, 2, 1, 3, 1, 2, 5, 3, 1, 2, 3, 4, 5, 4, 5, 4, 2, 1, 1, 2, 3, 3, 1, 1, 3, 2, 3, 5, 5, 4, 3, 2, 2, 3, 4, 1, 4, 2, 5, 2, 5],
};

export function getRegisteredAnswerKey(year, month, subjectKey, option) {
  const key = `${year}|${month}|${subjectKey}|${option}`;
  return answerKeys[key] ? [...answerKeys[key]] : null;
}
