// Seeded random number generator for deterministic question selection
function seededRandom(seed: string): () => number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  return function() {
    hash = Math.sin(hash) * 10000;
    return hash - Math.floor(hash);
  };
}

function shuffleArray<T>(array: T[], random: () => number): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export interface Question {
  id: string;
  question: string;
  options: [string, string, string];
  correctAnswer: 0 | 1 | 2;
  explanation: string;
  level: 'basic' | 'intermediate' | 'advanced' | 'upper-advanced';
}

// Comprehensive question bank
const questionBank: Question[] = [
  // BASIC LEVEL (20 questions pool)
  { id: 'b1', question: 'She ___ to the store yesterday.', options: ['go', 'went', 'goes'], correctAnswer: 1, explanation: '"Went" is the past tense of "go." Use past tense for completed actions.', level: 'basic' },
  { id: 'b2', question: 'They ___ playing in the park.', options: ['is', 'am', 'are'], correctAnswer: 2, explanation: '"Are" is used with plural subjects like "they."', level: 'basic' },
  { id: 'b3', question: 'I have ___ apple.', options: ['a', 'an', 'the'], correctAnswer: 1, explanation: '"An" is used before words starting with vowel sounds.', level: 'basic' },
  { id: 'b4', question: 'The cat is ___ the table.', options: ['on', 'at', 'in'], correctAnswer: 0, explanation: '"On" indicates position above and touching a surface.', level: 'basic' },
  { id: 'b5', question: 'She ___ her homework every day.', options: ['do', 'does', 'doing'], correctAnswer: 1, explanation: '"Does" is used with third-person singular subjects in present tense.', level: 'basic' },
  { id: 'b6', question: '___ you like coffee?', options: ['Do', 'Does', 'Is'], correctAnswer: 0, explanation: '"Do" is used to form questions with "you."', level: 'basic' },
  { id: 'b7', question: 'He is ___ than his brother.', options: ['tall', 'taller', 'tallest'], correctAnswer: 1, explanation: 'Comparative adjectives ("taller") are used when comparing two things.', level: 'basic' },
  { id: 'b8', question: 'We ___ English at school.', options: ['learn', 'learns', 'learning'], correctAnswer: 0, explanation: '"Learn" is the base form used with "we."', level: 'basic' },
  { id: 'b9', question: 'This is ___ book.', options: ['my', 'me', 'I'], correctAnswer: 0, explanation: '"My" is a possessive adjective used before nouns.', level: 'basic' },
  { id: 'b10', question: 'There ___ many students in the class.', options: ['is', 'are', 'be'], correctAnswer: 1, explanation: '"Are" is used with plural nouns like "students."', level: 'basic' },
  { id: 'b11', question: 'She can ___ very well.', options: ['sings', 'singing', 'sing'], correctAnswer: 2, explanation: 'After modal verbs like "can," use the base form of the verb.', level: 'basic' },
  { id: 'b12', question: 'I ___ breakfast at 7 AM.', options: ['have', 'has', 'having'], correctAnswer: 0, explanation: '"Have" is used with "I" in simple present tense.', level: 'basic' },
  { id: 'b13', question: 'The children ___ in the garden.', options: ['plays', 'play', 'playing'], correctAnswer: 1, explanation: '"Children" is plural, so use "play" without the -s.', level: 'basic' },
  { id: 'b14', question: 'He ___ a new car last week.', options: ['buy', 'buys', 'bought'], correctAnswer: 2, explanation: '"Bought" is the past tense of "buy."', level: 'basic' },
  { id: 'b15', question: 'My sister is ___ doctor.', options: ['a', 'an', 'the'], correctAnswer: 0, explanation: '"A" is used before consonant sounds.', level: 'basic' },
  { id: 'b16', question: '___ are you going?', options: ['Where', 'What', 'Who'], correctAnswer: 0, explanation: '"Where" asks about location or destination.', level: 'basic' },
  { id: 'b17', question: 'I ___ see you tomorrow.', options: ['will', 'would', 'was'], correctAnswer: 0, explanation: '"Will" is used to express future actions.', level: 'basic' },
  { id: 'b18', question: 'She gave the book to ___.', options: ['I', 'me', 'my'], correctAnswer: 1, explanation: '"Me" is an object pronoun used after prepositions.', level: 'basic' },
  { id: 'b19', question: 'They ___ TV every evening.', options: ['watch', 'watches', 'watched'], correctAnswer: 0, explanation: '"Watch" is used with "they" in simple present.', level: 'basic' },
  { id: 'b20', question: 'The sun ___ in the east.', options: ['rise', 'rises', 'rising'], correctAnswer: 1, explanation: '"Rises" is used for habitual facts with singular subjects.', level: 'basic' },

  // INTERMEDIATE LEVEL (20 questions pool)
  { id: 'i1', question: 'By the time she arrived, we ___ already left.', options: ['have', 'had', 'has'], correctAnswer: 1, explanation: 'Past perfect "had" is used for actions completed before another past action.', level: 'intermediate' },
  { id: 'i2', question: 'If I ___ rich, I would travel the world.', options: ['am', 'were', 'was'], correctAnswer: 1, explanation: '"Were" is used in second conditional for unreal present situations.', level: 'intermediate' },
  { id: 'i3', question: 'She asked me ___ I was coming to the party.', options: ['that', 'if', 'what'], correctAnswer: 1, explanation: '"If" introduces indirect yes/no questions.', level: 'intermediate' },
  { id: 'i4', question: 'I wish I ___ more time to read.', options: ['have', 'had', 'having'], correctAnswer: 1, explanation: '"Wish + past tense" expresses desires for present situations.', level: 'intermediate' },
  { id: 'i5', question: 'The book, ___ I bought yesterday, is very interesting.', options: ['that', 'which', 'what'], correctAnswer: 1, explanation: '"Which" introduces non-defining relative clauses with commas.', level: 'intermediate' },
  { id: 'i6', question: 'He ___ be at home; his car is in the driveway.', options: ['must', 'might', 'can'], correctAnswer: 0, explanation: '"Must" expresses strong logical deduction.', level: 'intermediate' },
  { id: 'i7', question: 'I\'m used to ___ early in the morning.', options: ['wake', 'waking', 'woke'], correctAnswer: 1, explanation: '"Used to" + gerund describes habits we are accustomed to.', level: 'intermediate' },
  { id: 'i8', question: 'Neither the teacher nor the students ___ present.', options: ['was', 'were', 'is'], correctAnswer: 1, explanation: 'With "neither...nor," the verb agrees with the nearest subject.', level: 'intermediate' },
  { id: 'i9', question: 'The meeting has been ___ until next week.', options: ['postponed', 'postponing', 'postpone'], correctAnswer: 0, explanation: 'Past participle is used after "has been" in passive voice.', level: 'intermediate' },
  { id: 'i10', question: 'She suggested ___ to the beach.', options: ['to go', 'going', 'go'], correctAnswer: 1, explanation: '"Suggest" is followed by a gerund.', level: 'intermediate' },
  { id: 'i11', question: 'Despite ___ tired, she continued working.', options: ['being', 'be', 'to be'], correctAnswer: 0, explanation: '"Despite" is followed by a gerund or noun.', level: 'intermediate' },
  { id: 'i12', question: 'You\'d better ___ now or you\'ll be late.', options: ['leave', 'to leave', 'leaving'], correctAnswer: 0, explanation: '"Had better" is followed by the base form of the verb.', level: 'intermediate' },
  { id: 'i13', question: 'Not only ___ intelligent, but also hardworking.', options: ['she is', 'is she', 'she was'], correctAnswer: 1, explanation: '"Not only" at the start causes subject-verb inversion.', level: 'intermediate' },
  { id: 'i14', question: 'I\'d rather you ___ smoke in here.', options: ['don\'t', 'didn\'t', 'won\'t'], correctAnswer: 1, explanation: '"Would rather" + subject takes past tense for present meaning.', level: 'intermediate' },
  { id: 'i15', question: 'It\'s high time we ___ a decision.', options: ['make', 'made', 'making'], correctAnswer: 1, explanation: '"It\'s high time" is followed by past tense.', level: 'intermediate' },
  { id: 'i16', question: 'The more you practice, ___ you become.', options: ['better', 'the better', 'best'], correctAnswer: 1, explanation: '"The + comparative...the + comparative" shows parallel increase.', level: 'intermediate' },
  { id: 'i17', question: 'He denied ___ the window.', options: ['break', 'breaking', 'to break'], correctAnswer: 1, explanation: '"Deny" is followed by a gerund.', level: 'intermediate' },
  { id: 'i18', question: 'Were I you, I ___ accept the offer.', options: ['will', 'would', 'shall'], correctAnswer: 1, explanation: 'Inverted conditionals use "would" in the main clause.', level: 'intermediate' },
  { id: 'i19', question: 'Hardly had I arrived ___ it started raining.', options: ['than', 'when', 'then'], correctAnswer: 1, explanation: '"Hardly...when" is a correlative conjunction pair.', level: 'intermediate' },
  { id: 'i20', question: 'She\'s ___ to have won the lottery.', options: ['reported', 'reporting', 'reports'], correctAnswer: 0, explanation: 'Passive reporting structure uses past participle.', level: 'intermediate' },

  // ADVANCED LEVEL (20 questions pool)
  { id: 'a1', question: 'Had I known about the meeting, I ___ attended.', options: ['would have', 'will have', 'had'], correctAnswer: 0, explanation: 'Third conditional with inversion uses "would have" + past participle.', level: 'advanced' },
  { id: 'a2', question: 'The phenomenon ___ he referred is quite rare.', options: ['which', 'to which', 'that'], correctAnswer: 1, explanation: '"Refer to" requires the preposition before the relative pronoun.', level: 'advanced' },
  { id: 'a3', question: 'Scarcely had he finished speaking ___ the audience applauded.', options: ['than', 'when', 'that'], correctAnswer: 1, explanation: '"Scarcely...when" is the correct correlative pair for immediate sequence.', level: 'advanced' },
  { id: 'a4', question: 'It is imperative that he ___ present at the hearing.', options: ['is', 'be', 'was'], correctAnswer: 1, explanation: 'Subjunctive mood uses base form after "imperative that."', level: 'advanced' },
  { id: 'a5', question: 'So ___ was her performance that everyone was moved.', options: ['touching', 'touched', 'touchingly'], correctAnswer: 0, explanation: 'After "so + adjective" in this emphatic structure, use the adjective form.', level: 'advanced' },
  { id: 'a6', question: '___ circumstances should you reveal this information.', options: ['Under no', 'In no', 'By no'], correctAnswer: 0, explanation: '"Under no circumstances" is the idiomatic phrase meaning "never."', level: 'advanced' },
  { id: 'a7', question: 'The theory, ___ validity is still debated, has many supporters.', options: ['which', 'whose', 'that'], correctAnswer: 1, explanation: '"Whose" shows possession for things as well as people.', level: 'advanced' },
  { id: 'a8', question: 'Much ___ I admire her work, I disagree with her conclusions.', options: ['as', 'that', 'while'], correctAnswer: 0, explanation: '"Much as" introduces a concessive clause meaning "although."', level: 'advanced' },
  { id: 'a9', question: 'The data ___ to support the hypothesis.', options: ['seem', 'seems', 'seeming'], correctAnswer: 0, explanation: '"Data" is traditionally plural and takes "seem."', level: 'advanced' },
  { id: 'a10', question: 'They demanded that the report ___ immediately.', options: ['is submitted', 'be submitted', 'was submitted'], correctAnswer: 1, explanation: 'Subjunctive mood in passive form: "be + past participle."', level: 'advanced' },
  { id: 'a11', question: 'The committee ___ divided on this issue.', options: ['is', 'are', 'were'], correctAnswer: 1, explanation: '"Committee" is collective; when divided, treat as plural.', level: 'advanced' },
  { id: 'a12', question: 'Little ___ he know what awaited him.', options: ['do', 'did', 'does'], correctAnswer: 1, explanation: 'Negative adverb "little" causes inversion with past tense.', level: 'advanced' },
  { id: 'a13', question: 'She spoke ___ she had rehearsed for months.', options: ['as if', 'as though', 'as'], correctAnswer: 2, explanation: '"As" here introduces a manner clause meaning "in the way that."', level: 'advanced' },
  { id: 'a14', question: 'No sooner had the concert ended ___ the rain began.', options: ['than', 'when', 'that'], correctAnswer: 0, explanation: '"No sooner...than" is the correct correlative pair.', level: 'advanced' },
  { id: 'a15', question: 'Were it not for his intervention, we ___ failed.', options: ['would have', 'will have', 'should have'], correctAnswer: 0, explanation: 'Inverted third conditional uses "would have" for past unreal.', level: 'advanced' },
  { id: 'a16', question: 'It is essential that every member ___ informed.', options: ['is', 'be', 'being'], correctAnswer: 1, explanation: 'Mandative subjunctive requires base form "be."', level: 'advanced' },
  { id: 'a17', question: 'The issue ___ which we are concerned is urgent.', options: ['about', 'with', 'for'], correctAnswer: 1, explanation: '"Concerned with" is the correct collocation for topics.', level: 'advanced' },
  { id: 'a18', question: 'Only after the test ___ the results released.', options: ['the results were', 'were', 'was'], correctAnswer: 1, explanation: 'Fronted adverbial "Only after" causes subject-verb inversion.', level: 'advanced' },
  { id: 'a19', question: 'Such was his anger ___ he could barely speak.', options: ['as', 'that', 'which'], correctAnswer: 1, explanation: '"Such...that" introduces a result clause.', level: 'advanced' },
  { id: 'a20', question: 'The contract stipulates that payment ___ within 30 days.', options: ['is made', 'be made', 'will be made'], correctAnswer: 1, explanation: 'Subjunctive after "stipulates that" uses base form.', level: 'advanced' },

  // UPPER-ADVANCED LEVEL (20 questions pool)
  { id: 'u1', question: 'Far ___ it from me to criticize, but this approach seems flawed.', options: ['be', 'is', 'being'], correctAnswer: 0, explanation: '"Far be it from me" is a fixed subjunctive expression.', level: 'upper-advanced' },
  { id: 'u2', question: 'The findings notwithstanding, the board ___ to proceed.', options: ['decide', 'decided', 'deciding'], correctAnswer: 1, explanation: 'Main clause requires finite verb; past tense fits narrative.', level: 'upper-advanced' },
  { id: 'u3', question: 'So complex is the matter ___ simple solutions are inadequate.', options: ['as', 'that', 'which'], correctAnswer: 1, explanation: 'Inverted "so...that" structure for emphasis.', level: 'upper-advanced' },
  { id: 'u4', question: 'The phenomenon, ___ the researchers are at a loss to explain, persists.', options: ['which', 'for which', 'that'], correctAnswer: 0, explanation: '"Which" as object of the clause; preposition moves with verb.', level: 'upper-advanced' },
  { id: 'u5', question: 'Never before ___ such a dramatic shift in policy.', options: ['there has been', 'has there been', 'there was'], correctAnswer: 1, explanation: 'Negative adverb fronting requires subject-auxiliary inversion.', level: 'upper-advanced' },
  { id: 'u6', question: 'Lest we ___ the same mistakes, caution is advised.', options: ['repeat', 'repeated', 'repeating'], correctAnswer: 0, explanation: '"Lest" triggers subjunctive mood with base form.', level: 'upper-advanced' },
  { id: 'u7', question: 'The theory posits that consciousness ___ an emergent property.', options: ['is', 'be', 'being'], correctAnswer: 1, explanation: '"Posit that" in formal English takes subjunctive.', level: 'upper-advanced' },
  { id: 'u8', question: 'His manner of speaking, ___ antiquated, charmed the audience.', options: ['albeit', 'although', 'despite'], correctAnswer: 0, explanation: '"Albeit" means "although it is" and takes adjectives directly.', level: 'upper-advanced' },
  { id: 'u9', question: '___ it be necessary, additional resources will be allocated.', options: ['Should', 'Would', 'If'], correctAnswer: 0, explanation: '"Should" inversion replaces "If it should" in formal conditionals.', level: 'upper-advanced' },
  { id: 'u10', question: 'The evidence, such ___ it is, remains inconclusive.', options: ['that', 'as', 'which'], correctAnswer: 1, explanation: '"Such as it is" is a fixed phrase meaning "limited though it is."', level: 'upper-advanced' },
  { id: 'u11', question: 'On no account ___ this information to be disclosed.', options: ['is', 'was', 'being'], correctAnswer: 0, explanation: 'Negative fronting with passive: auxiliary "is" inverts.', level: 'upper-advanced' },
  { id: 'u12', question: 'It was not until the 20th century ___ the theory was accepted.', options: ['when', 'that', 'which'], correctAnswer: 1, explanation: 'Cleft sentence "It was...that" for emphasis.', level: 'upper-advanced' },
  { id: 'u13', question: 'The manuscript, ___ provenance is uncertain, fetched millions.', options: ['which', 'whose', 'of which the'], correctAnswer: 2, explanation: 'Formal style uses "of which the" for possession.', level: 'upper-advanced' },
  { id: 'u14', question: 'Try ___ he might, he could not solve the equation.', options: ['as', 'though', 'if'], correctAnswer: 0, explanation: '"Try as he might" is an inverted concessive structure.', level: 'upper-advanced' },
  { id: 'u15', question: 'The proposal that she ___ appointed was rejected.', options: ['is', 'be', 'was'], correctAnswer: 1, explanation: 'Subjunctive in noun clause after "proposal that."', level: 'upper-advanced' },
  { id: 'u16', question: 'Not a word ___ he say during the entire meeting.', options: ['did', 'does', 'had'], correctAnswer: 0, explanation: 'Negative object fronting triggers inversion with "did."', level: 'upper-advanced' },
  { id: 'u17', question: 'The theory, ___ speculative as it may seem, has merit.', options: ['however', 'as', 'though'], correctAnswer: 0, explanation: '"However + adjective" introduces concession.', level: 'upper-advanced' },
  { id: 'u18', question: 'It is recommended that the policy ___ reviewed annually.', options: ['is', 'be', 'was'], correctAnswer: 1, explanation: 'Mandative subjunctive after "recommended that."', level: 'upper-advanced' },
  { id: 'u19', question: 'So be it; the decision, ___ unpopular, stands.', options: ['however', 'albeit', 'notwithstanding'], correctAnswer: 1, explanation: '"Albeit" concedes the adjective while affirming the main point.', level: 'upper-advanced' },
  { id: 'u20', question: '___ the circumstances, alternative measures must be considered.', options: ['Given', 'Giving', 'To give'], correctAnswer: 0, explanation: '"Given" as preposition means "considering."', level: 'upper-advanced' },
];

export function generateQuestionsForUser(username: string): Question[] {
  const random = seededRandom(username.toLowerCase().trim());
  
  const levels: Array<'basic' | 'intermediate' | 'advanced' | 'upper-advanced'> = [
    'basic', 'intermediate', 'advanced', 'upper-advanced'
  ];
  
  const selectedQuestions: Question[] = [];
  
  for (const level of levels) {
    const levelQuestions = questionBank.filter(q => q.level === level);
    const shuffled = shuffleArray(levelQuestions, random);
    selectedQuestions.push(...shuffled.slice(0, 10));
  }
  
  return selectedQuestions;
}

export function getQuestionsForLevel(questions: Question[], level: 'basic' | 'intermediate' | 'advanced' | 'upper-advanced'): Question[] {
  return questions.filter(q => q.level === level);
}

export function calculateScore(questions: Question[], answers: Record<string, number>): {
  total: number;
  levelScores: Record<string, number>;
  incorrectAnswers: Array<{ question: Question; userAnswer: number }>;
} {
  const levelScores: Record<string, number> = {
    basic: 0,
    intermediate: 0,
    advanced: 0,
    'upper-advanced': 0,
  };
  
  const incorrectAnswers: Array<{ question: Question; userAnswer: number }> = [];
  
  questions.forEach(q => {
    const userAnswer = answers[q.id];
    if (userAnswer === q.correctAnswer) {
      levelScores[q.level]++;
    } else {
      incorrectAnswers.push({ question: q, userAnswer });
    }
  });
  
  const total = Object.values(levelScores).reduce((sum, score) => sum + score, 0);
  
  return { total, levelScores, incorrectAnswers };
}

export function getProficiencyLabel(score: number): {
  label: string;
  description: string;
  color: 'basic' | 'intermediate' | 'advanced' | 'proficient';
} {
  if (score >= 35) {
    return { label: 'Proficient', description: 'Exceptional command of English grammar', color: 'proficient' };
  } else if (score >= 28) {
    return { label: 'Advanced', description: 'Strong grasp of complex grammatical structures', color: 'advanced' };
  } else if (score >= 20) {
    return { label: 'Intermediate', description: 'Good understanding of essential grammar rules', color: 'intermediate' };
  } else {
    return { label: 'Basic', description: 'Foundation level with room for growth', color: 'basic' };
  }
}
