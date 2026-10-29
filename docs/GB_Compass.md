# Gabrielle Compass — 지표 설계 최종 종합본

이 문서는 Compass의 4개 섹션(Reach / Engagement / Ranking / Growth Potential)에 대한 지표 설계, 계산 로직, 그 로직을 선택한 근거, 실제 계산 사례를 정리한 최종본입니다.

---

## 0. 설계 원칙

성격이 다른 지표를 하나의 숫자로 억지로 합치지 않는다.

Compass는 완전히 독립된 4개 섹션으로 구성되며, ICP 카피("Become Known → Become Trusted → Become Recommended")와 다음과 같이 대응됩니다.

- Reach → Become Known — 얼마나 알려졌나 (사람 단위, 폭)
- Engagement → Become Trusted — 얼마나 신뢰받나 (행동 단위·가중치, 깊이)
- Ranking → Self별 종합 순위
- Growth Potential → Become Recommended의 근거 — 앞으로 얼마나 클 수 있나 (SNS 데이터와 완전 독립)

핵심 구조 원칙: Reach와 Engagement는 같은 원본 데이터(Exposure, Reaction, Conversation, Amplification)에서 각각 독립적으로 계산되며, 한쪽에서 가공된 값(Qualified Reach)을 다른 쪽 계산의 분모로 재사용하지 않습니다. 반응이 적어서 이미 깎인 값을 다시 분모로 쓰면, 반응이 적을수록 결과가 더 좋아 보이는 역설이 생깁니다.

재발 방지 체크리스트(신규 지표 설계 시 우선 검토):

1. 나눴다가 다시 곱하면 상쇄된다(예: Exposure로 나눈 값을 다시 Exposure에 곱하면 원본이 사라짐).
2. 가공된 값을 다른 계산의 재료(특히 분모)로 재사용하면 순환 참조가 생긴다.
3. 평균 대비 clip은 "얼마나 더 잘했는지"의 정보를 뭉갠다. 최고기록 대비가 더 세밀한 차등을 유지한다.
4. 비율(Rate)의 상한은 명확한 논리적 근거가 있을 때만 clip한다.
5. 정보가 없을 때 "중간값"으로 채우는 것은 근거 없는 후한 추정이다. 보수적인 최저값 또는 방향성 없는 중립값이 더 안전하다(어느 쪽이 맞는지는 "책임 소재"로 구분 — 4부 참조).
6. 외부 벤치마크보다 본인의 과거 데이터가 안전하다(소스 신뢰성·관련성·유지보수 측면).
7. 무료 API로 실제 구할 수 없는 데이터는 근사치로 타협하되, 근거를 명시한다.
8. 서로 다른 성격의 데이터(폭 vs 깊이, 사람 단위 vs 행동 단위)는 섞지 않고 역할을 분리한다.

사례 유저 설정 (전체 섹션 공통): SaaS Data Scientist, 3개 Self 운영 중 — A(Data Analyst), B(Career Transition Story), C(SaaS Consulting)

---

## 1. Reach — Become Known

### 보여주는 것

Qualified Reach 단일 숫자만 노출합니다. 세부 breakdown은 Engagement 섹션에서만 노출해 역할 중복을 방지합니다.

### 계산 로직

1단계. Unique Responders (근사치) = max(Reaction, Conversation, Amplification)

왜 근사치인지: "좋아요/댓글/공유 중 하나라도 한 고유 인원"을 정확히 세려면 유저ID 단위 중복제거가 필요한데, 무료 API는 대부분 집계된 숫자만 제공해 실제 중복제거가 불가능합니다. "댓글·공유한 사람은 대부분 좋아요도 눌렀을 것"이라는 현실적 가정 하에, 셋 중 가장 큰 값을 근사 하한선으로 사용합니다.

2단계. Response Rate = Unique Responders ÷ Exposure × 100

3단계. 각 포스팅의 Response Rate는 게시 후 7일 시점에 "확정"됩니다. X·Threads는 24~48시간, Instagram은 2~3일, LinkedIn은 3~7일까지 반응이 쌓이는 경향이 있어, 7일이면 전 플랫폼 반응이 거의 다 쌓인 시점으로 봅니다(LinkedIn 기준으로도 이미 상한선을 채택). 7일 미만 포스팅은 "집계 중" 상태로 제외합니다. **플랫폼별 확정 기간 차등 적용은 검토 후 채택하지 않습니다** — "최근 9개"를 플랫폼 통합 관리하기로 한 원칙과 구조적으로 충돌하고(플랫폼마다 확정 시점이 다르면 같은 풀 안에서 상태 관리가 복잡해짐), 7일이 이미 LinkedIn의 반응 누적 상한선을 반영한 값이라 차등화로 얻는 정확도 향상이 구조적 비용 대비 크지 않기 때문입니다.

4단계. Quality Factor (원본) = 이번 포스팅 Response Rate ÷ 최근 9개 포스팅 중 최고 Response Rate

5단계. Quality Factor (최종) = min(1.0, 4단계 값)

6단계. Scale Factor = √(이번 포스팅 Exposure ÷ 최근 9개 포스팅 평균 Exposure)

7단계. Qualified Reach = min(이번 포스팅 Exposure, Unique Responders × Quality Factor(최종) × Scale Factor)

**설계 근거:**

- Qualified Reach를 "Exposure × 보정값"이 아니라 "Unique Responders(반응자 수) × 두 보정값"으로 계산합니다. Exposure를 나눴다가 다시 곱하는 구조는 대수적으로 상쇄되어 사라지는 문제가 있었기 때문입니다(과거 버전에서 확인된 버그 — 노출 5,000과 50,000인 두 포스팅이 반응자 수만 같으면 최종값이 완전히 동일하게 나왔음).
- **Quality Factor(품질 보정)**는 "반응률이 최근 9개 중 최고 대비 얼마나 좋았나"를, **Scale Factor(규모 보정)**는 "이번 노출 규모가 최근 9개 평균 대비 얼마나 컸나"를 봅니다. 서로 다른 질문에 답하므로 분리해서 곱하는 방식으로 결합합니다.
- Scale Factor에 제곱근(√)을 쓰는 이유: 노출 차이를 완전히 무시하지도, 완전히 비례 반영하지도 않는 중간 지점을 만들기 위함입니다. 극단적인 노출 차이(바이럴 등)가 결과를 과도하게 부풀리는 것을 막아줍니다.
- **플랫폼별 Quality Factor 분리는 보류합니다.** 플랫폼마다 반응 습성이 다르므로(LinkedIn은 반응이 느리고 적은 편, Instagram은 상대적으로 빠르고 많은 편) 이론적으로는 분리 계산이 더 정확하지만, 지금은 유저당 플랫폼별 데이터가 충분히 쌓이지 않아 분리해도 통계적으로 불안정한 값만 나옵니다. 유저 데이터가 충분히 누적된 뒤 재검토합니다.
- Quality Factor는 "최고 기록" 기준, Scale Factor는 "평균" 기준을 씁니다 — 전자는 세밀한 품질 차등(이상치에 민감한 최고값이 적합)이, 후자는 안정적인 규모 대표값(이상치에 둔감한 평균이 적합)이 목적이기 때문입니다.
- 7단계 min()은 "9개끼리 비교해 최솟값을 고른다"는 뜻이 아니라, 이 포스팅 하나의 계산 결과가 이 포스팅 하나의 원본 Exposure를 넘지 않도록 막는 최종 안전장치입니다(Qualified Reach는 Exposure 중 유효한 부분만 걸러낸 값이므로, 할인만 가능하고 할증은 불가능해야 함).

왜 N=9인지: 콘텐츠가 9개 번들 단위로 자동생성되는 제품 구조와 일치합니다. 다만 이 "9개"는 생성 단계의 번들이 아니라 측정 단계에서 "실제로 게시된 최근 9개"를 뜻합니다.

왜 외부 벤치마크가 아니라 본인 과거 데이터를 쓰는지: 외부 리포트(Socialinsider·Buffer 등)는 "Engagement Rate" 계산 정의가 소스마다 달라 같은 지표가 최대 4~26배까지 벌어지고, B2B 타겟과의 관련성도 낮습니다. 본인 데이터는 API로 이미 확보 중이라 외부 의존이 없고, 순수한 자기 성장 서사로 제품 톤에도 부합합니다.

**"최근 9개" 정의 (경계 케이스 포함):**

- **"최근 9개"는 고정 목록이 아니라, "현재 시점 기준 7일을 넘긴 포스팅 중 가장 최근 9개"를 그때그때 다시 뽑는 것입니다.** 7일을 넘기는 순간 자동으로 이 풀에 들어가고, 9개를 초과하면 가장 오래된 것이 자동으로 빠집니다.
- **새 포스팅을 올려도 이미 열린 화면이 다시 잠기지 않습니다.** 7일 미만 포스팅은 "집계 중" 상태로만 남아 이 풀에 포함되지 않습니다.
- **모든 값(개별 포스팅 값, 벤치마크)은 그 포스팅이 9개 풀 안에 남아있는 동안 실시간으로 갱신됩니다.** 9개 밖으로 밀려나는 순간 그 시점 값에서 갱신이 중단됩니다.
- **벤치마크(최고/평균) 계산 시 평가 대상 포스팅 자신도 그 9개 안에 포함됩니다** (9개 미만이면 애초에 계산이 시작되지 않으므로 "자신을 제외한 8개" 상황은 성립하지 않음).
- **최근 9개 중 최고 Response Rate가 0%인 경우, Qualified Reach는 자연히 0이 됩니다** (이번 포스팅도 9개 안에 포함되므로, 최고 Response Rate=0%는 이번 포스팅을 포함한 9개 전부의 반응자가 0명일 때만 성립 — 별도 0÷0 예외 처리가 불필요).

**플랫폼 관리:** 플랫폼별 분리 관리는 구현 복잡도가 높아 보류하고, 최근 9개는 플랫폼 구분 없이 통합 집계합니다. **동일 콘텐츠를 여러 플랫폼에 게시한 경우**, 1개로 합치지 않고 플랫폼별로 각각 별도의 포스팅으로 카운트합니다(플랫폼마다 반응이 크게 다를 수 있으므로). "최근 9개" 풀은 콘텐츠 단위가 아닌 포스팅 단위로 관리되므로 별도 이중 구조는 필요 없습니다.

### 콜드스타트 처리

조건: 포스팅 9개 미만 또는 게시 7일 미경과 → 잠김

**잠금 사유는 두 가지로 구분해 다른 문구를 노출합니다:**

- ① 포스팅 부족: "Reach needs 9 posts, each at least 7 days old, to show results."
- ② 데이터 수집 실패(연동은 됐으나 API 호출 오류 등): "We couldn't fetch your data — please try again shortly."

(계정 미연동 사유는 Compass 범위에서 다루지 않아 제외합니다.)
(화면 디자인은 Figma에서 별도 반영)

### 사례

Self A, 최근 9개 포스팅: 평균 Exposure = 2,000, 최고 Response Rate = 1.8%

[사례① 반응이 아주 좋았던 포스팅]

```
Exposure = 10,000 / Reaction=200, Conversation=20, Amplification=10
Unique Responders = max(200, 20, 10) = 200
Response Rate = 200 ÷ 10,000 × 100 = 2.0%
Quality Factor = min(1.0, 2.0%÷1.8%) = min(1.0, 1.11) = 1.0
Scale Factor = √(10,000 ÷ 2,000) = √5 = 2.24
Qualified Reach = min(10,000, 200 × 1.0 × 2.24) = min(10,000, 448) = 448
```

[사례② 반응이 평범했던 포스팅]

```
Exposure = 8,000 / Reaction=40, Conversation=5, Amplification=1
Unique Responders = max(40, 5, 1) = 40
Response Rate = 40 ÷ 8,000 × 100 = 0.5%
Quality Factor = 0.5% ÷ 1.8% = 0.278 (clip 대상 아님)
Scale Factor = √(8,000 ÷ 2,000) = √4 = 2.0
Qualified Reach = min(8,000, 40 × 0.278 × 2.0) = min(8,000, 22.2) = 22.2
```

[사례③ 노출은 컸지만 반응이 희박했던 포스팅]

```
Exposure = 50,000 / Reaction=45, Conversation=0, Amplification=0
Unique Responders = max(45, 0, 0) = 45
Response Rate = 45 ÷ 50,000 × 100 = 0.09%
Quality Factor = 0.09% ÷ 1.8% = 0.05
Scale Factor = √(50,000 ÷ 2,000) = √25 = 5.0
Qualified Reach = min(50,000, 45 × 0.05 × 5.0) = min(50,000, 11.25) = 11.25
```

(사례②·③ 비교: Exposure는 8,000 vs 50,000으로 크게 다르지만 결과는 22.2 vs 11.25로, 노출만 크고 반응이 희박한 포스팅이 오히려 더 낮게 평가됩니다.)

[사례④ 바이럴 — min() 안전장치가 실제로 작동하는 경우]

```
Exposure = 2,000,000 / Reaction=250,000, Conversation=0, Amplification=0
Unique Responders = 250,000
Response Rate = 250,000 ÷ 2,000,000 × 100 = 12.5%
Quality Factor = min(1.0, 12.5%÷1.8%) = min(1.0, 6.94) = 1.0
Scale Factor = √(2,000,000 ÷ 2,000) = √1,000 = 31.6
원본 계산값 = 250,000 × 1.0 × 31.6 = 7,900,000 (원본 Exposure 초과)
Qualified Reach = min(2,000,000, 7,900,000) = 2,000,000  ← min()이 작동해 Exposure로 제한됨
```

---

## 2. Engagement — Become Trusted

### 보여주는 것

Engagement Intensity (%) — 참여의 밀도/열성도를 보여주는 지표를 메인으로, Reaction/Conversation/Amplification 세부 breakdown(절대 개수)을 함께 노출합니다.

이름: "Engagement Rate"는 "노출 대비 참여율"로 오해되기 쉬워, "Engagement Intensity"로 확정합니다.

### 계산 로직

```
Engagement Score = (Reaction×1) + (Conversation×3) + (Amplification×5)
Engagement Intensity = Engagement Score ÷ Exposure × 100 (분모는 반드시 Exposure, clip 없음)
```

### 설계 근거

이 지표는 "노출된 사람 중 몇 %가 참여했나(참여율)"가 아니라, "참여한 사람들이 얼마나 무겁게 반응했는가(열성도)"를 봅니다. 좋아요보다 댓글이, 댓글보다 공유가 더 무겁다고 보고 노력 수준에 따라 차등 가중치를 둡니다. 퍼스널 브랜딩에서는 "얼마나 널리 퍼졌는가"보다 "본 사람들이 얼마나 신뢰하는가"가 더 본질적인 신호이기 때문입니다.

**왜 분모가 반드시 Exposure여야 하는지:** Qualified Reach는 이미 반응 데이터로 "깎인" 값이라, 이걸 분모로 다시 쓰면 반응이 저조할수록 Engagement Intensity가 오히려 부풀려지는 순환 참조가 발생합니다(예: Engagement Score=60을 Exposure 8,000으로 나누면 0.75%지만, 반응 저조로 이미 깎인 Qualified Reach 2,224로 나누면 2.70%로 3.6배 부풀려짐). Exposure는 가공되지 않은 원본값이라 이 문제가 없습니다.

**왜 clip을 두지 않는지:** 가중치 구조(합 9배)상 정상적인 데이터로도 100%를 넘을 수 있으며, 이는 오류가 아니라 폭발적 반응의 정직한 신호입니다. "데이터 오류"와 "진짜 좋은 성과"를 구분할 근거가 없어, 원본 그대로 노출하고 짧은 안내 문구로 오해를 방지합니다.

### 사례

[사례①] (섹션1 사례①과 동일 포스팅)
Engagement Score = (200×1)+(20×3)+(10×5) = 310, Engagement Intensity = 310÷10,000×100 = 3.10%

[사례②] (섹션1 사례②와 동일 포스팅)
Engagement Score = 60, Engagement Intensity = 60÷8,000×100 = 0.75%

[사례③ 100% 초과 예시]
Exposure=1,000, Reaction=800, Conversation=300, Amplification=100
Engagement Score = 800+900+500 = 2,200, Engagement Intensity = 2,200÷1,000×100 = 220% → clip 없이 그대로 노출

### 화면 구성

Engagement Intensity 3.10% / 좋아요 200 · 댓글 20 · 공유 10 / ⓘ 댓글·공유는 가중치가 있어 100%를 넘을 수도 있어요

### 콜드스타트 처리

조건: 포스팅 9개 미만 또는 최신 포스팅 게시 7일 미경과 → 잠김 (계산식 자체는 포스팅 1개로도 완결되지만, Reach와 노출 타이밍을 동일하게 맞춥니다 — 우측 패널에서 두 카드가 나란히 보이는데 하나만 먼저 열리면 유저가 "버그인가" 오해할 수 있으므로, 두 카드가 항상 함께 열리도록 통일)

---

## 3. Ranking

### 보여주는 것

Self(페르소나)별 SNS 성과 종합 순위

### 계산 로직

```
1단계. Self가 N명일 때, Qualified Reach 기준으로 1~N등, Engagement Intensity
       기준으로 1~N등을 각각 매깁니다(둘 다 "최근 9개 중 최고 기록" 값 사용).
2단계. 등수를 점수로 뒤집습니다: 1등 = N점, 2등 = N-1점, ..., N등 = 1점
3단계. 최종 점수 = (Engagement 점수 × 2) + (Reach 점수 × 1)
4단계. 이 최종 점수로 다시 순위를 매깁니다. 동점이면 Engagement 등수가
       더 높은 쪽을 상위로 처리합니다.
```

단위/스케일이 다른 두 값을 곱셈·나눗셈으로 합치지 않고, 각각 순위를 매긴 뒤 순위(를 뒤집은 점수)끼리 가중합을 내어 스케일 왜곡을 원천 차단합니다.

**왜 Engagement에 2배 가중치를 주는지:** "리치가 아무리 커도 인게이지먼트가 낮으면 효용이 적다"는 판단에 따라 두 지표를 1:1로 평균 내지 않고 Engagement를 더 중요하게 반영합니다. 2:1이라는 정수 비율을 택한 이유는, 동점이 나와도 4단계 규칙으로 해소되므로 소수 가중치를 쓸 실익이 적고 정수가 더 이해하기 쉽기 때문입니다.

이 방식은 양 극단(둘 다 1등/둘 다 꼴찌)과 "한쪽만 극단적으로 좋을 때 Engagement 우세가 항상 더 높다"는 방향성은 항상 보장하지만, 중간 구간의 세부 순서까지는 완벽히 보장하지 않습니다(선형 가중합 방식의 구조적 한계).

**여기서 쓰이는 값은 "최근 9개 중 최고 기록"(Most Reached/Most Engaged)입니다.** 평균이 아니라 최고 기록을 쓰는 이유는, "잘 나온 포스팅에는 이유가 있다"는 전제 하에 학습·재현 동기를 주기 위함입니다. 평균만 보여주면 오히려 "항상 평균에만 머무르는" 모순이 생길 수 있습니다.

### 사례

Self A(Data Analyst): Qualified Reach 12,000 / Engagement Intensity 3.5%
Self B(Career Transition): Qualified Reach 18,000 / Engagement Intensity 1.2%
Self C(SaaS Consulting): Qualified Reach 5,000 / Engagement Intensity 2.5%

Reach 순위: B=1, A=2, C=3 / Engagement 순위: A=1, C=2, B=3

최종순위 = (Reach순위 + Engagement순위) ÷ 2
A: (2+1)/2=1.5, B: (1+3)/2=2.0, C: (3+2)/2=2.5 → 결과: A 1위, B 2위, C 3위

해석: B는 Reach 1등이었지만 Engagement가 낮아 종합 2위로 밀립니다. A는 어느 한쪽도 1등은 아니지만 양쪽 다 고르게 좋아 종합 1위가 됩니다.

### 원형 시각화 표현 방식

**좌측 원형에서 각 Self는 순위 서수 배지("1st", "2nd" 등)로만 표현됩니다.** 크기·색상으로 순위를 인코딩하지 않습니다 — Reach·Engagement 카드의 증감 배지가 이미 색상(빨강=하락/초록=상승)을 다른 의미로 쓰고 있어, 원형에까지 색상으로 순위를 표현하면 유저가 매번 다른 기준을 학습해야 하는 혼란이 생기기 때문입니다. **우측 패널에는 순위 요약을 별도로 담지 않습니다** — 우측 패널은 Self 하나에 대한 깊이 있는 정보를 전담하는 자리로 역할이 고정되어 있습니다(8부 참조).

### 콜드스타트 처리

조건: Self가 1개뿐이거나, Qualified Reach가 계산된 Self가 2개 미만일 때 → 잠김

---

## 4. Growth Potential — Become Recommended의 근거

### 이 섹션의 역할

Reach·Engagement는 "지금 SNS에서 벌어지는 반응"을 보여주지만, Growth Potential은 SNS 데이터와 완전히 독립적으로 "이 사람을 추천해도 되는 배경적 근거"를 보여줍니다. 경력 8년차인데 이제 막 포스팅을 시작한 사람은 SNS 지표는 낮게 나오지만 실제 잠재력은 높을 수 있습니다.

### 공식

Growth Potential = (A × B) / 100 (A, B는 각각 0~100점 스케일)

곱셈인 이유: 산업이 죽어가거나 경력이 없으면 잠재력도 낮아지는 것이 상식이며, 둘 중 하나라도 0에 가까우면 전체 점수도 낮아져야 하므로 곱셈이 맞습니다.

### A: 산업 성장성 / Content Trend

핵심 분기는 단 하나 — 온보딩 "직업" 텍스트가 미국 표준 직업코드(SOC)에 매칭되는지 여부입니다. "직업인지 취미인지"를 판단하는 별도 로직은 두지 않습니다.

**경로 1. SOC 매칭 성공 시 — "Industry Growth" (BLS 기반, 확정)**

온보딩 "직업" 텍스트를 O*NET API로 SOC 코드 매칭 후, BLS(미국 노동통계청) Employment Projections API로 향후 10년 고용 성장률(%)을 조회해 0~100점으로 정규화합니다. 마켓캡(산업 규모)이 아니라 성장률을 쓰는 이유는 "지금 올라탈 파도인가"를 보려면 절대 규모보다 성장 속도가 적합하기 때문입니다.

프리랜서 타이틀("Fractional CFO" 등) 매칭 정확도를 위해, 온보딩 시 ICP 카테고리를 보조 선택지로 살짝 유도합니다.

정규화 구간표 (미국 전체 직업 평균 10년 성장률, BLS 최신 발표치를 50점 기준으로 매년 자동 갱신 — 2024-2034 최신 발표치는 3.1%):

- -10% 이하 → 0~20점
- -10%~0% → 20~40점
- 0%~평균 → 40~50점
- 평균 (기준점) → 50점
- 평균~15% → 50~75점
- 15%~30% → 75~90점
- 30% 이상 → 90~100점

**경계값 검증(2024-2034 BLS 실제 데이터 기준):** 15%·30% 두 경계 모두 실제 분포와 잘 맞습니다 — 30% 이상 구간엔 미국 전체 최상위 4개 직업(wind turbine technician 49.9%, solar installer 42.1%, nurse practitioner 40.1%, data scientist 33.5%)만 들어가고, 15~30% 구간엔 5~10위권 직업들(information security analyst 28.5%~physician assistant 20.4%)이 들어갑니다. 최상위 점수대를 진짜 극소수 직업에만 부여하는 설계로 확정합니다.

구간 내 점수는 선형보간으로 계산합니다. 예: 30~50% 구간을 90~100점에 매핑 → A = 90 + (성장률-30)×(10/20). 성장률 +35%인 경우: A = 90+2.5 = 92.5 ≈ 93점.

**경로 2. SOC 매칭 실패 시 — "Content Trend" (SerpApi 기반, 근사치)**

_데이터 소스 변경 취지: Google Custom Search(전체 웹 검색 모드)가 2027년 1월 폐지 예정이라 대체. 무료 공식 API(YouTube, GDELT, Wikipedia Pageviews)는 각각 플랫폼 편향·직업 커버리지 부족·동음이의어 문제로 기각. 유료 SERP 재판매 서비스 중 데이터 형태(total_results 필드)가 Custom Search와 동일해 기존 로직을 그대로 재사용 가능하고, API 키 하나로 연결되는 SerpApi로 최종 확정._

O*NET에서 SOC 코드가 매칭되지 않으면(사유 불문 — 신흥 직업, 취미, 또는 입력 표현 문제일 수 있음), 직업/관심사 텍스트를 그대로 키워드 삼아 SerpApi(Google Search 엔진 모드)로 **"최근 기간 콘텐츠 신규 생성 증가율"**을 조회합니다.

**"검색량"이 아니라 "콘텐츠양"을 재는 이유:** 검색은 궁금해서 검색창에 몇 글자 치는 가벼운 행동이라 반짝 화제에 쉽게 흔들리지만, 콘텐츠 제작은 시간과 노력이 드는 무거운 행동이라 더 강한 신호일 수 있습니다.

**라벨을 "Industry Growth"가 아니라 "Content Trend"로 부르는 이유:** 콘텐츠 증가 추이는 산업 성장률과 다른 개념이라, 노동시장 데이터로 착각시키지 않기 위해 직업·취미 어느 쪽에도 자연스러운 중립적 라벨을 씁니다.

계산 방법:
1단계. SerpApi 응답의 `search_information.total_results` 필드로 최근 90일과 이전 90일의 검색 결과 개수를 각각 조회합니다.
2단계. 이전 기간 결과가 1건 이상이면: 증감률 = (최근-이전)÷이전×100을 항상 이 공식으로 계산합니다(극단적으로 튀는 값은 아래 최상위 구간이 흡수하므로 별도 예외 경계값을 두지 않음).

콘텐츠 트렌드 전용 구간표:

- -50% 이하 → 0~20점
- -50%~-10% → 20~40점
- -10%~10% → 40~50점 (선형보간, 0%는 45점)
- 10%~50% → 50~75점
- 50%~150% → 75~90점
- 150% 이상 → 90~100점 (150~300%를 90~100점에 매핑, 300% 초과는 100점 상한)

3단계. **이전 기간 결과가 정확히 0건인 경우에만** 증감률 계산을 생략하고 "콘텐츠 근본적으로 희소함" 상태로 분류합니다(아래 콜드스타트 3단계 참조). 이 경계값(0건)은 수학적으로 나눗셈이 불가능한 유일한 경우라 임의성이 없습니다.

**API 호출 최적화(캐싱):** 같은 직업/취미 키워드로 여러 유저가 겹쳐 들어올 수 있으므로, 최초 조회 시 결과를 캐싱해두고 일정 기간(예: 7일) 재사용한 뒤 재조회합니다. 무료 등급(월 250회) 소진을 방지하는 보조 장치입니다. **유료 전환 임계점:** 월 250회 중 200회(80%) 도달 시 내부 알림, 250회 도달 시 자동으로 유료 종량제로 전환해 서비스 중단 없이 이어지도록 합니다.

예시: "AI Prompt Engineer" 이전 90일 4,000건→최근 6,500건 → +62.5% → A≈78점. "Vintage Fashion" 이전 90일 3,000건→최근 7,260건 → +142% → A≈88.8점.

### B: 경력 준비도 — 경력 기간(연차)만으로 계산

라벨은 SOC 매칭 성공/실패와 무관하게 항상 **"Experience"**로 통일합니다(A와 달리 B는 항상 동일한 방법으로 계산되어 소스가 안 바뀌고, "Career Readiness"는 취미 케이스에 개념적으로 안 맞기 때문).

추상적 평가 요소(리드경험/성과서술 등)는 전부 배제하고 오직 "연차"만으로 계산합니다. 이유: Know Thyself는 자유 서술형이라 유저가 "무엇을 채워야 점수가 잘 나오는지" 알 수 없고, 연차 외 요소는 AI가 텍스트 뉘앙스를 주관적으로 판단해야 하는 위험이 있으며, 온보딩 필드 중 경력과 직접 관련된 것은 "직업" 텍스트뿐이라 추가 입력(레쥬메 등)은 제품 모토와 어긋납니다.

연차 → 점수 구간표 (업계 통용 경력 단계 기준(Entry 0~2년/Mid 2~5년/Mid-Senior 5~8년/Senior 8~12년+)과 대조 검증 완료, 구조 유지):

- 0~1년 → 20점
- 2~4년 → 45점
- 5~9년 → 70점
- 10년+ → 90점

**연차 언급이 없으면 최저 구간(20점)으로 보수적 처리합니다.** 중간값(50점)이 아닌 이유는 "정보 없음"을 "중간 정도"로 후하게 추정하는 것이 근거 없는 낙관이기 때문입니다. 완전히 잠그지는 않고, "확정치/잠정치" 개념으로 구분해 보완을 유도합니다(단, 화면에 별도 배지는 노출하지 않음 — 8부 참조).

**향후 로드맵(현재는 규칙기반 유지):** 지금은 위 구간표(0~1/2~4/5~9/10+년)로 계산하지만, 장기적으로는 "유저 누적 후 또래 백분위 비교" 방식으로 전환할 수 있습니다. 전환은 전체 일괄이 아니라 **직업군(SOC 코드) 단위로 개별 전환**합니다 — 각 직업군에 유저 데이터가 최소 100명 이상 쌓이면 그 직업군만 백분위 비교로 전환하고, 데이터가 부족한 직업군은 계속 규칙기반을 유지합니다. 표본이 적은 채로 백분위 전환하면 통계적으로 불안정한 값이 나오기 때문입니다.

**연차 추출 AI 프롬프트:**

```
System:
당신은 유저의 자기소개 텍스트에서 "경력 연차"만 추출하는 도구입니다.

규칙:
1. 명시적으로 언급되거나("5년째", "3년 넘게") 계산 가능한 경우("2019년부터",
   현재 연도 기준 역산)만 숫자로 추출합니다.
2. "많은 경력", "베테랑", "주니어" 같은 숫자 없는 표현은 추출하지 마세요
   (years_mentioned: false).
3. 나이는 절대 연차 추정에 사용하지 마세요.
4. 여러 활동이 언급되면, 온보딩 "직업" 필드와 가장 관련 있는 연차만 추출하세요.
5. 확신이 없으면 반드시 years_mentioned: false를 반환하세요.
   애매할 때 숫자를 지어내지 마세요.

출력(JSON만):
{"years_mentioned": true/false, "years_value": 숫자 또는 null,
 "evidence_quote": "근거 원문 또는 null"}

현재 연도: {current_year} / 유저 직업: {occupation_text} /
유저 텍스트: {know_thyself_text}
```

**구간(0~1/2~4/5~9/10+) 매핑은 AI가 아니라 코드에서 결정론적으로 처리합니다** — AI는 텍스트에서 숫자를 뽑는 불확실한 작업만, 점수 매핑은 확정된 구간표(코드)가 담당하도록 역할을 분리해 오류 범위를 제한합니다.

### 계산 사례

[케이스 A: 연차 언급 있음] Data Scientist / "5년 넘게 일했어요" → A=91.75, B=70 → GP=(91.75×70)/100=64.2 ≈ 64%
[케이스 B: 연차 언급 없음] Data Scientist / 연차 미기재 → A=91.75, B=20 → GP=(91.75×20)/100=18.35 ≈ 18%
[케이스 C: SOC 실패, 신흥직업+연차 있음] "AI Prompt Engineer"/"3년째" → A=78, B=45 → GP=35%
[케이스 D: SOC 실패, 취미+연차 없음] "Vintage Fashion"/연차 미기재 → A=88.8, B=20 → GP=18%

케이스 A만 "확정치"이며, 나머지는 A 또는 B 중 하나라도 추정값이 섞여 "잠정치"입니다. **다만 화면에는 확정치/잠정치 배지를 노출하지 않습니다** — "Confirmed"라는 표현이 재료 중 하나(BLS)가 공식 통계라는 사실과 최종 합성 점수 자체의 검증을 혼동시켜 신뢰도를 과장하기 때문입니다.

### 콜드스타트 및 데이터 실패 처리 — 3단계 구조

```
1단계: SOC 매칭 시도 → 성공: BLS 성장률("Industry Growth") / 실패: 2단계
2단계: SerpApi로 콘텐츠 증가율 조회
       → 이전 기간 1건 이상: 증가율 계산("Content Trend") / 정확히 0건: 3단계
3단계: 콘텐츠 근본적 희소(측정 불가) → 중립값(50점) + 안내 문구
```

B(경력 연차)는 Know Thyself 미완료와 연차 언급 없음을 동일하게 최저구간(20점)으로 처리합니다. 이 3단계 구조를 포함해도 "콜드스타트 없음" 원칙은 유지됩니다(3단계도 값 자체는 계산해서 보여주므로 — 단, "API 기술적 실패"는 예외).

**왜 3단계에서 최저점이 아니라 중립값(50점)인지:**

|                    | 원인                 | 책임 소재                               | 처리              |
| ------------------ | -------------------- | --------------------------------------- | ----------------- |
| B(연차 미기재)     | 유저가 정보를 안 줌  | 유저가 채울 수 있었음                   | 최저점(보수적)    |
| 3단계(콘텐츠 희소) | 세상에 데이터가 적음 | 누구 책임도 아님, 판단 근거 자체가 없음 | 중립값(판단 유보) |

연차 미기재는 유저가 알려줄 수 있었는데 안 알려준 것이라 보수적 처리가 정당하지만, 콘텐츠 희소는 데이터가 적은 이유(관심이 없어서인지, 최첨단이라 아직 안 다뤄져서인지)를 판단할 근거가 없어 중립으로 처리합니다.

**3단계 안내 문구:** "Data is too new or niche to measure growth yet, so we're showing a neutral estimate." (주어를 "Data"로 두어, 문제의 책임 소재가 유저의 분야가 아니라 측정 재료 부족에 있음을 명확히 함)

**API 기술적 실패는 3단계와 다르게 처리(Retry 패턴):** 3단계(콘텐츠 희소)는 API가 정상 응답했으나 콘텐츠 자체가 없는 경우라 재시도해도 안 바뀌므로 중립값+안내 문구로 값을 보여주지만, O*NET·BLS·SerpApi 접근 자체가 안 되는 "API 기술적 실패"는 재시도로 해결될 수 있으므로 Reach·Engagement와 동일한 Retry 화면(원형 X 아이콘 + "We couldn't fetch your data" + "please try again shortly." + Retry 버튼)으로 대체합니다. 이는 "콜드스타트 없음" 원칙의 유일한 예외입니다.

**연차(B) 미기재 안내 문구는 이 예외와 무관하게 그대로 유지됩니다:** "Not enough data to calculate this accurately." (API 오류가 아니라 정상 계산된 잠정치이므로 카드가 에러 상태로 바뀌지 않음)

---

## 5. Compass 전체 UX 공통 패턴

- Reach: 포스팅 9개 미만 또는 게시 후 7일 미경과 시 → 잠김
- Engagement: 포스팅 9개 미만 또는 최신 포스팅 게시 후 7일 미경과 시 → 잠김 (Reach와 동일)
- Ranking: Self 1개뿐이거나 Qualified Reach 계산된 Self 2개 미만 시 → 잠김
- Growth Potential: 콜드스타트 없음(온보딩만 완료해도 항상 확정치 또는 잠정치로 값 노출)

콜드스타트가 있는 세 섹션은 "잠김 → 조건 충족 → 열림" 구조를 따르며, Compass의 "입력 정보가 파티클로 뭉쳐 구체를 이루는" 시각적 컨셉과 맞물립니다. Growth Potential만 예외적으로 처음부터 항상 열려 있습니다.

**파티클의 의미(오해 방지):** 이 파티클 하나하나는 포스팅·반응 등 SNS 개별 데이터 포인트가 아닙니다. 유저가 입력한 정보(예: Know Thyself persona 소개글 등)에서 추출한 **키워드**를 시각화한 것입니다. 즉 파티클 개수/밀도는 "활동량"이 아니라 "입력된 정보의 키워드량"을 나타냅니다.

---

## 6. 최종 요약

- **Reach (Become Known):** 폭(사람 단위). 노출 지표는 Qualified Reach. 계산 핵심은 Unique Responders × Quality Factor(최근 9개 최고 Response Rate 대비, 0~1 clip) × Scale Factor(최근 9개 평균 Exposure 대비, √보정), 최종적으로 min()으로 원본 Exposure 제한. 콜드스타트: 9개 미만 또는 7일 미경과.
- **Engagement (Become Trusted):** 깊이/신뢰(행동 단위, 가중치). 계산 핵심은 가중 Engagement Score ÷ Exposure, clip 없음. 콜드스타트: Reach와 동일.
- **Ranking:** 종합 순위. 계산 핵심은 Qualified Reach·Engagement Intensity 등수의 가중합(Engagement 2배). 콜드스타트: Self 1개뿐이거나 비교 가능 Self 2개 미만.
- **Growth Potential (Become Recommended 근거):** 배경 잠재력(SNS 독립). 계산 핵심은 직업(BLS 또는 Content Trend) × 경력 연차. 콜드스타트 없음(단, API 기술적 실패 시 Retry 예외).

---

## 7. 남은 다음 단계 (Open Items)

현재 없음. (Ranking 원형 표현·플랫폼별 Quality Factor·Growth Potential B 로드맵·원형 툴팁 정상 상태 문구·Growth Potential 신뢰도 배지·SerpApi 임계점은 각 해당 섹션에 최종 결론으로 반영 완료. 파티클-구체 연출·온보딩 드롭다운 UX·콜드스타트 문구 인용부호 통일·GP 카드-원형 CTA 혼동 우려는 진행하지 않는 것으로 확정되어 제거됨.)

---

## 8. Compass 우측 패널 카드 UI 확정안

Compass 좌측은 Self별 원형 데이터 시각화(파티클-구체), 우측 패널은 탭 선택과 무관하게 항상 고정된 카드 세트를 보여주는 구조입니다. 우측 패널은 세 카드로 구성되며, 순서는 **Growth Potential → Reach → Engagement**입니다(Ranking은 별도 카드로 만들지 않고 좌측 원형 시각화가 여러 Self 간 비교 역할을 대신).

**카드 순서 근거:** "포스팅 없이도 정보를 줄 수 있는 순서" 기준 — Growth Potential은 콜드스타트가 없어 온보딩만 마쳐도 즉시 값이 있는 반면, Reach·Engagement는 둘 다 포스팅 9개+7일 경과가 필요합니다. 신규 유저가 위에서부터 "이미 채워진 것 → 아직 비어있는 것" 순서로 읽히도록 배치합니다.

**Ranking을 별도 카드로 만들지 않는 이유:** 세 카드만으로도 우측 패널이 이미 길고, Ranking은 "여러 Self 비교"라는 다른 성격의 정보라 같은 형식으로 늘어놓으면 혼란을 줍니다. 계산 재료(Qualified Reach, Engagement Intensity)도 이미 위 카드들에 노출되어 있어 재조합의 실질 가치가 낮습니다. 좌측 원형이 이미 "여러 Self를 한 화면에 배치"하는 형태이므로 그 안에서 비교/순위를 표현합니다.

### 좌측 원형 시각화의 대표값 — Most Recent가 아니라 Most Reached/Engaged

좌측 원형은 우측 카드와 달리 나란히 비교할 대상 없이 숫자 하나만 단독 노출됩니다. 이 때문에 변동성이 큰 Most Recent 대신 **Most Reached(또는 Most Engaged)를 대표값으로 사용합니다** — 저조한 순간에 화면을 열었을 때 맥락 없이 위축된 숫자만 마주하는 것을 방지하고, 원형이라는 자리(진입 시 첫인상, 확신 부여)에 더 적합하기 때문입니다.

**우측 카드는 반대로 Most Recent를 왼쪽(메인)에 둡니다** — 카드는 두 값이 항상 나란히 있어 맥락이 이미 존재하고, 증감 배지가 Most Recent에만 붙어 핵심 액션 정보 역할을 하며, 재방문 시 유저가 매번 궁금한 것은 "이번엔 어땠는지"이기 때문입니다. 좌측 원형과 우측 카드는 서로 다른 이유로 다른 값을 우선하는, 의도된 역할 분담입니다.

### 좌측 원형 클릭과 우측 패널 Self 전환은 서로 다른 인터랙션

- **원형(Self 아바타) 클릭 → Content Studio로 이동.** 우측 패널이 갱신되는 게 아니라 포스팅 작성을 시작하도록 유도합니다.
- **우측 패널 상단 탭 클릭 → 우측 패널의 Self 전환.**
- **원형 클릭 시 뜨는 툴팁 → 순수 정보 표시** (지표 설명 또는 콜드스타트 안내).

### 공통 패턴

각 카드는 다음 구조를 공유합니다:

- 카드 제목 (Qualified Reach / Engagement Intensity / Growth Potential)
- 우측 상단 ICP 카피 태그 (Become Known / Become Trusted / Become Recommended)
- 태그 아래, 이 지표가 무엇을 측정하는지 선언하는 설명 문구
- Reach·Engagement는 좌우 분할(**왼쪽=Most Reached/Engaged, 오른쪽=Most Recent**), 각 라벨 옆 클릭 시 원본 포스팅 이동 화살표(↗)
- Growth Potential은 좌우 분할 없이 메인 숫자 단독 배치

**"Most Recent Post"가 여전히 의미 있는 이유:** 콘텐츠는 9개 번들로 생성되지만 일부만 선별 게시될 수 있습니다("게시됐다"는 사실 자체가 이미 "9개 중 세상에 내보낼 가치가 있다고 판단된 것"이라는 선택의 의미). Reach·Engagement 지표는 게시된 포스팅에만 데이터가 발생하므로, 생성 단계의 "9개 번들"과 측정 단계의 "최근 9개"는 서로 다른 기준입니다.

### Reach 카드 확정 문구

- 카드 제목: "Qualified Reach"
- 태그: "Become Known"
- 설명: "An estimate of how many people your content actually reached, not just how many times it was shown."
- 좌측: "Most Reached Post" — 최근 9개 중 최고 기록(예: 8,340), 증감 배지 없음
- 우측: "Most Recent Post" — 메인 숫자(예: 6,150) + 증감 배지("-8% vs Previous Post", 하락은 빨강)
- Response Rate, breakdown 등 추가 정보는 넣지 않음(표면적 사실만 나열하는 항목은 판단에 도움이 되지 않음)

Engagement 카드와의 구분: Reach는 "몇 명에게 도달했나(폭)", Engagement는 "얼마나 깊게 반응했나(깊이)"로 서로 다른 단어·질문을 씁니다.

### Engagement 카드 확정 문구

- 카드 제목: "Engagement Intensity"
- 태그: "Become Trusted"
- 설명(2문장): "Not a click count." + "This measures how deeply people responded to your post — comments and shares count for more than a like."
- 좌측: "Most Engaged Post" — 최근 9개 중 최고 기록(예: 6.1%) + Breakdown (Most Engaged Post도 "왜 반응이 좋았는지" 학습할 수 있어야 하므로 우측에도 상세정보 포함)
- 우측: "Most Recent Post" — 메인 숫자(예: 4.3%) + 증감 배지("+0.2pp vs Previous Post", 상승은 초록, 단위는 %가 아닌 pp) + 동일한 Breakdown
- 가중치 배율(×1, ×3, ×5)은 breakdown에 표기하지 않음(계산식 노출보다 텍스트 선언으로 차별점 전달)
- 카드 하단 공통 안내문: "Can go above 100% — comments and shares count more than likes."

설명 문구는 심리적 해석("확신을 잰다")을 배제하고 "얼마나 깊게 반응했는지"라는 정의 자체를 먼저 밝히는 데 초점을 둡니다 — 계산식이 행동의 이유(긍정/부정)를 구분 못 하므로, "확신"이라는 심리 상태를 안다고 주장하지 않기 위함입니다.

### Growth Potential 카드 확정 문구

메인 숫자는 좌우 분할 없이 단독 배치. **상태 배지(Confirmed/Estimated)는 화면에 노출하지 않습니다** — "Confirmed"가 재료(BLS)의 공식성과 최종 합성 점수의 검증을 혼동시켜 신뢰도를 과장하기 때문입니다.

**공통 구조**

- 설명: SOC 성공 시 "It reflects how promising your career background is, based on 'official U.S. labor statistics' and your experience." / 실패 시 "Your field isn't officially classified yet, so this is based on 'search trend data' instead — a lighter, rougher read than industry data."
- 메인 숫자: A×B 계산값 (배지 없이 숫자만)
- Industry Growth(SOC 성공) 또는 Content Trend(SOC 실패): A의 근거 한 줄
- Experience: B의 근거 한 줄. 연차 확인 시 실제 값(예: "10 years")
- **Experience 미확인 시:** "Not enough data to calculate this accurately." (A의 상태와 무관하게 Experience 필드 전용 문구. 연차가 실제로 짧다고 확인된 경우엔 이 문구를 넣지 않음)
- CTA 버튼: "Update in Know thyself" (확정치/잠정치 여부와 무관하게 항상 노출)

**계산 예시 (83%, SOC 매칭 성공)**

```
A = 91.75점 (Data Scientist, +33.5% → 30% 이상 구간 선형보간: 90+(33.5-30)*0.5)
B = 90점 (Experience 10년+)
GP = (91.75 × 90) / 100 = 82.6 ≈ 83%
```

> Growth Potential — It reflects how promising your career background is, based on 'official U.S. labor statistics' and your experience.
> **83%** — Industry Growth: Data Scientist, +33.5% projected over 10 years — Experience: 10 years — Update in Know thyself

**Experience 미확인 사례**

```
A = 91.75점, B = 20점(연차 미확인) → GP = (91.75×20)/100 = 18.35 ≈ 18%
```

> **18%** — Industry Growth: Data Scientist, +33.5% projected over 10 years — Experience: Not enough data to calculate this accurately.

이 케이스는 Industry Growth(A)가 정상 확정값이어도 Experience(B)가 보정값(20점)이므로 "잠정치"에 해당하며, 9부 규칙에 따라 원형 Estimate 라벨 + 카드 테두리 강조가 함께 적용됩니다(이 문서의 "80%, SOC 매칭 성공" 확정치 사례와는 시각적으로 구분됨).

**Content Trend 사례 (SOC 실패, 80%)**

```
A = 88.8점 (Vintage Fashion, +142% 증가 → 50~150% 구간 선형보간)
B = 90점 (Experience 10년+) → GP = 79.92 ≈ 80%
```

> Growth Potential — Your field isn't officially classified yet, so this is based on 'search trend data' instead — a lighter, rougher read than industry data.
> **80%** — Content Trend: Vintage Fashion — content mentions have more than doubled in the past year — Experience: 10 years — Update in Know thyself

**3단계(콘텐츠 근본적 희소) 사례 — Retry가 아닌 중립값 처리**

> Growth Potential — Data is too new or niche to measure growth yet, so we're showing a neutral estimate.
> **20%** — Industry Growth: Not enough data to show industry detail — Experience: Not enough data to calculate this accurately. — Update in Know thyself

**API 기술적 실패 사례 (Retry 패턴)**
화면 노출: 원형 X 아이콘 + "We couldn't fetch your data" + "please try again shortly." + "Retry" 링크

### B 라벨 통일 — "Career Readiness"가 아닌 "Experience"

B는 SOC 매칭 성공/실패와 무관하게 항상 "Experience"로 통일합니다. A는 매칭 여부에 따라 데이터 소스가 바뀌어 라벨도 다르게 불러야 하지만, B는 항상 동일한 방법(Know Thyself에서 연차 추출)으로 계산되므로 소스가 안 바뀝니다. "Career Readiness"는 취미 케이스("요리 5년차")에 개념적으로 안 맞아 배제했습니다.

---

## 9. 좌측 원형 시각화 툴팁 확정안

좌측 원형에서 각 지표를 클릭했을 때 뜨는 툴팁 문구입니다. 콜드스타트 상태는 카드의 콜드스타트 문구를 그대로 재사용해 카드와 원형이 같은 이야기를 하도록 일관성을 맞춥니다.

**공통 원칙:**

- 지표명은 카드에서 확정한 이름(Qualified Reach, Engagement Intensity)을 그대로 사용, 구용어("Engagement Rate" 등) 배제
- "총 도달 인원 합계" 같은 합산 뉘앙스 문구 배제(원형은 Most Reached/Engaged를 대표값으로 사용)
- 계산 방법 설명보다 결과의 의미를 직관적으로 전달
- 행동 유도 문구에는 반드시 구체적인 동사 포함

**Reach 툴팁 (콜드스타트):**

```
No Reach Data Yet
Reach needs 9 posts, each at least 7 days old, to show results.
```

**Engagement 툴팁 (콜드스타트):**

```
No Engagement Data Yet
Engagement needs 9 posts, each at least 7 days old, to show results.
```

**Reach·Engagement 툴팁 (데이터 있음):** 여러 Self 중 해당 지표 값이 가장 큰(1위) Self에 대해서만 툴팁이 노출됩니다. 나머지 Self는 원형에 순위 배지만 표시되고 별도 수치 툴팁은 없습니다.

```
Most Reached: [X]     (예: Most Reached: 8,340)
Most Engaged: [X]%    (예: Most Engaged: 14.3%)
```

**Ranking 툴팁 (콜드스타트):**

```
No Ranking Data Yet
Shows which Self performs best across both reach and engagement.
Create another Self to start comparing.
```

(값을 합산한다는 표현은 사용하지 않음 — Ranking은 순위 평균 방식이므로. 은유적 표현도 배제하고 지표 이름을 그대로 쓰는 직접적인 표현을 택함) **데이터가 있는 정상 상태에서는 별도 툴팁이 없습니다** — 원형의 순위 배지("1st" 등)가 이미 순위를 보여주므로 추가 팝업이 불필요합니다.

**Growth Potential — 상태 배지 없음, 값만 표현:** 원형에는 신뢰도 배지(Confirmed/Estimated) 없이 Growth Potential % 값 자체가 배지 형태로 표시됩니다. **A(산업성장) 또는 B(경력 연차) 중 하나라도 데이터 부족으로 보정값이 적용된 경우 — 즉 A가 3단계(콘텐츠 근본적 희소, 중립값 50점)이거나, B가 연차 미기재로 최저구간(20점)이거나, 또는 둘 다인 경우(8부 기준 "잠정치" 전체) — 원형 배지가 퍼센트 대신 "Estimate (Not enough data)"로 표시되고, 우측 Growth Potential 카드에도 같은 상태를 알리는 강조 테두리가 함께 적용됩니다.**

이 Estimate 처리는 "데이터가 완전히 없는 경우"에만 한정되지 않습니다 — A·B 중 하나라도 실측값이 아닌 보정(fallback)값으로 메워진 모든 경우에 동일하게 적용되는 공통 규칙입니다. 반대로 **A가 Content Trend(SerpApi) 경로로 계산된 경우는 Estimate 트리거가 아닙니다** — 공식 BLS 통계가 아니라는 것뿐이지 "값 자체는 정상적으로 산출된 상태"이기 때문입니다(Content Trend 자체가 이미 SOC 매칭 실패에 대한 정식 대체 계산 경로이므로, 그 결과값은 "부족한 데이터"가 아니라 "다른 소스의 정상 데이터"로 취급합니다). 즉 Estimate 비주얼의 트리거는 "소스가 무엇이냐"가 아니라 "그 소스 안에서도 값을 못 구해 보수적/중립적 기본값으로 메웠느냐"입니다.

이는 우측 카드에서 "Confirmed/Estimated"라는 텍스트 배지 문구 자체를 노출하지 않는 원칙(8부)과는 별개입니다 — 문구로 신뢰도를 선언하지는 않지만, 원형의 "Estimate" 라벨과 카드 테두리 강조라는 시각적 장치로 암묵적으로 신뢰도 차이를 전달합니다.

**Growth Potential 툴팁 (콜드스타트 없음, 항상 노출):**

```
Growth Potential: [X]%
Start posting to turn this potential into real reach.
```

CTA 버튼은 없습니다(텍스트만 노출) — 카드 안의 CTA("Update in Know thyself")와 목적이 겹치지 않도록 원형 툴팁은 버튼을 두지 않는 것이 원래 설계이므로, 두 CTA가 한 화면에서 동시에 노출되어 혼동을 준다는 우려 자체가 성립하지 않습니다. "포스팅하면 Growth Potential이 오른다"는 인과관계는 암시하지 않고, "이미 존재하는 잠재력을 실제 성과(Reach)로 전환하자"는 방향만 서술합니다.

**데이터 부족 상태의 툴팁 (A 또는 B, 혹은 둘 다 부족한 경우):**

```
Growth Potential: [X]%
Not enough data to calculate this accurately.
```

CTA 버튼 없음. 카드 본문 Experience 필드와 동일한 문구를 재사용해, A만 부족하든 B만 부족하든 둘 다 부족하든 방향성 없이 공통 적용됩니다.
