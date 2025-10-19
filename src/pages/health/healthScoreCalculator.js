/**
 * 프론트엔드용 건강점수 간단 계산 (실시간 프리뷰)
 * 백엔드와 유사한 로직
 */

// 연령대 판단
const isYoungAge = (ageGroup) => {
  if (!ageGroup) return false;
  return ageGroup.includes('20대') || ageGroup.includes('30대');
};

const isMiddleAge = (ageGroup) => {
  if (!ageGroup) return false;
  return ageGroup.includes('40대') || ageGroup.includes('50대');
};

const isSeniorAge = (ageGroup) => {
  if (!ageGroup) return false;
  return ageGroup.includes('60대') || ageGroup.includes('70대');
};

// 나이 계산
const calculateAge = (birthDate) => {
  if (!birthDate) return null;
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

// 연령대 계산
const getAgeGroup = (age) => {
  if (!age) return null;
  if (age < 10) return '10세 미만';
  if (age < 20) return '10대';
  if (age < 30) return '20대';
  if (age < 40) return '30대';
  if (age < 50) return '40대';
  if (age < 60) return '50대';
  if (age < 70) return '60대';
  return '70대 이상';
};

export const calculatePreviewScore = (form) => {
  let score = 0;

  // 연령대 계산
  const age = form.birthDate ? calculateAge(form.birthDate) : null;
  const ageGroup = age ? getAgeGroup(age) : null;

  // 1. BMI (15점)
  if (form.height && form.weight) {
    const bmi = form.weight / ((form.height / 100) ** 2);
    const isYoung = isYoungAge(ageGroup);
    const isMiddle = isMiddleAge(ageGroup);
    const isSenior = isSeniorAge(ageGroup);

    if (isYoung) {
      if (bmi < 16) score += 5;
      else if (bmi < 18.5) score += 10;
      else if (bmi < 25) score += 15;
      else if (bmi < 30) score += 10;
      else score += 5;
    } else if (isMiddle) {
      if (bmi < 18.5) score += 8;
      else if (bmi < 26) score += 15;
      else if (bmi < 30) score += 10;
      else score += 5;
    } else if (isSenior) {
      if (bmi < 19) score += 8;
      else if (bmi < 27) score += 15;
      else if (bmi < 30) score += 12;
      else score += 8;
    } else {
      // 기본
      if (bmi >= 18.5 && bmi < 23) score += 15;
      else if (bmi >= 16 && bmi < 30) score += 10;
      else score += 5;
    }
  }

  // 2. 혈압 (20점)
  if (form.bloodPressureSystolic && form.bloodPressureDiastolic) {
    const sys = Number(form.bloodPressureSystolic);
    const dia = Number(form.bloodPressureDiastolic);

    if (sys < 90 || dia < 60) {
      score += 10;
    } else if (sys <= 120 && dia <= 80) {
      score += 20;
    } else if (sys <= 130 && dia <= 85) {
      score += 15;
    } else if (sys <= 140 && dia <= 90) {
      score += 10;
    } else {
      score += 5;
    }
  }

  // 3. 혈당 (15점)
  if (form.bloodSugar) {
    const bs = Number(form.bloodSugar);
    if (bs < 70) score += 8;
    else if (bs <= 100) score += 15;
    else if (bs <= 125) score += 10;
    else if (bs <= 180) score += 5;
    else score += 3;
  }

  // 4. 수면 (10점)
  if (form.sleepHours) {
    const hours = Number(form.sleepHours);
    const isAdult = isYoungAge(ageGroup) || isMiddleAge(ageGroup);

    if (isAdult) {
      if (hours < 5) score += 3;
      else if (hours < 7) score += 6;
      else if (hours <= 9) score += 10;
      else score += 7;
    } else {
      if (hours >= 7 && hours <= 9) score += 10;
      else if (hours >= 5) score += 6;
      else score += 3;
    }
  }

  // 5. 흡연 (15점)
  if (!form.smoking) score += 15;

  // 6. 음주 (15점)
  if (!form.drinking) {
    score += 15;
  } else if (form.drinkingPerWeek && form.drinkingPerOnce) {
    const weekly = Number(form.drinkingPerWeek) * Number(form.drinkingPerOnce);
    if (weekly <= 7) score += 15;
    else if (weekly <= 14) score += 10;
    else score += 5;
  } else {
    score += 10;
  }

  // 7. 기저질환 (5점)
  if (!form.chronicDiseaseYn) {
    score += 5;
  } else {
    const count = form.chronicDiseaseIds?.length || 0;
    if (count === 0) score += 5;
    else if (count === 1) score += 4;
    else if (count === 2) score += 3;
    else score += 2;
  }

  // 8. 알러지 (2점)
  if (!form.allergyYn) {
    score += 2;
  } else {
    const count = form.allergyIds?.length || 0;
    if (count === 0) score += 2;
    else score += 1;
  }

  // 9. 복용약 (3점)
  if (!form.medicationYn) {
    score += 3;
  } else {
    const count = form.medications?.length || 0;
    if (count === 0) score += 3;
    else if (count <= 2) score += 2;
    else score += 1;
  }

  return Math.min(Math.max(score, 0), 100);
};

export const getScoreGrade = (score) => {
  if (score >= 90) return { grade: 'A+', text: '매우 건강', color: '#10b981' };
  if (score >= 80) return { grade: 'A', text: '건강', color: '#22c55e' };
  if (score >= 70) return { grade: 'B+', text: '양호', color: '#84cc16' };
  if (score >= 60) return { grade: 'B', text: '보통', color: '#eab308' };
  if (score >= 50) return { grade: 'C+', text: '주의', color: '#f59e0b' };
  if (score >= 40) return { grade: 'C', text: '관리필요', color: '#f97316' };
  return { grade: 'D', text: '위험', color: '#ef4444' };
};