import type { Lesson, QuizQuestion } from "../backend.d";

export const SUBJECTS = ["Tamil", "English", "Math", "Science", "Social Studies"];

export const SUBJECT_ICONS: Record<string, string> = {
  Tamil: "📚",
  English: "✏️",
  Math: "🔢",
  Science: "🔬",
  "Social Studies": "🌍",
};

export const SUBJECT_COLORS: Record<string, string> = {
  Tamil: "from-pink-500 to-rose-500",
  English: "from-blue-500 to-indigo-500",
  Math: "from-purple-500 to-violet-600",
  Science: "from-teal-500 to-cyan-500",
  "Social Studies": "from-teal-500 to-cyan-500",
};

export const SUBJECT_BG: Record<string, string> = {
  Tamil: "bg-rose-50 border-rose-200",
  English: "bg-blue-50 border-blue-200",
  Math: "bg-purple-50 border-purple-200",
  Science: "bg-teal-50 border-teal-200",
  "Social Studies": "bg-teal-50 border-teal-200",
};

export const VOICE_PERSONAS = [
  { id: "Vijay", name: "Vijay", emoji: "🎬", label: "Actor", desc: "Deep & Powerful" },
  { id: "Samantha", name: "Samantha", emoji: "🌟", label: "Actress", desc: "Clear & Warm" },
  { id: "Dora", name: "Dora", emoji: "🗺️", label: "Cartoon", desc: "High & Excited" },
  { id: "Shinchan", name: "Shinchan", emoji: "😄", label: "Cartoon", desc: "Energetic & Fun" },
  { id: "Robot AI", name: "Robot AI", emoji: "🤖", label: "Default", desc: "Clear Robotic" },
];

export const PERSONA_TTS_SETTINGS: Record<string, { pitch: number; rate: number }> = {
  Vijay: { pitch: 0.6, rate: 0.85 },
  Samantha: { pitch: 1.1, rate: 0.95 },
  Dora: { pitch: 1.5, rate: 1.2 },
  Shinchan: { pitch: 1.6, rate: 1.3 },
  "Robot AI": { pitch: 0.8, rate: 1.0 },
};

export const SAMPLE_LESSONS: Record<string, Lesson[]> = {
  Math: [
    {
      day: 1n,
      title: "Introduction to Algebra",
      subject: "Math",
      grade: 8n,
      content: `Welcome to Algebra! Today we'll learn what algebra is and why it's so useful.

Algebra is a branch of mathematics that uses letters and symbols to represent numbers and quantities in equations. Instead of saying "a number plus 5 equals 8," we write: x + 5 = 8.

**What is a Variable?**
A variable is a letter that stands for an unknown number. Common variables are x, y, and z. For example:
- If x + 3 = 7, then x = 4
- If 2y = 10, then y = 5

**Why Do We Need Algebra?**
Algebra helps us solve real-world problems. If you know that 3 apples cost ₹30, you can use algebra to find the cost of 1 apple: 3x = 30, so x = ₹10.

**Key Terms:**
- Expression: A combination of numbers, variables, and operations (e.g., 2x + 3)
- Equation: Two expressions connected by an equals sign (e.g., 2x + 3 = 11)
- Coefficient: The number before a variable (e.g., in 5x, the coefficient is 5)

**Practice:**
Try solving: x + 7 = 12
Answer: x = 12 - 7 = 5

Great job! Tomorrow we'll explore more complex equations.`,
    },
    {
      day: 2n,
      title: "Solving Linear Equations",
      subject: "Math",
      grade: 8n,
      content: `Today we'll learn how to solve linear equations step by step!

A linear equation has variables raised to the power of 1. The goal is to find the value of the unknown variable.

**The Golden Rule of Equations:**
Whatever you do to one side of the equation, you must do to the other side too!

**Steps to Solve:**
1. Simplify both sides if needed
2. Move variable terms to one side
3. Move number terms to the other side
4. Divide to isolate the variable

**Example 1:** Solve 3x + 5 = 20
- Step 1: 3x + 5 - 5 = 20 - 5 → 3x = 15
- Step 2: 3x ÷ 3 = 15 ÷ 3 → x = 5
- Check: 3(5) + 5 = 15 + 5 = 20 ✓

**Example 2:** Solve 2x - 8 = 4
- Step 1: 2x = 4 + 8 = 12
- Step 2: x = 12 ÷ 2 = 6
- Check: 2(6) - 8 = 12 - 8 = 4 ✓

**Practice Problems:**
1. 4x + 3 = 19 (Answer: x = 4)
2. 5x - 10 = 15 (Answer: x = 5)
3. 7x + 2 = 30 (Answer: x = 4)

You're doing amazing! Keep practicing!`,
    },
    {
      day: 3n,
      title: "Quadratic Expressions",
      subject: "Math",
      grade: 8n,
      content: `Today we explore quadratic expressions — the next big step in algebra!

A quadratic expression has a variable squared (x²). The standard form is: ax² + bx + c

**Examples of Quadratic Expressions:**
- x² + 5x + 6
- 3x² - 2x + 1
- x² - 9

**Expanding Brackets:**
(x + 2)(x + 3) = x² + 3x + 2x + 6 = x² + 5x + 6

**Factoring Quadratics:**
To factor x² + 5x + 6, find two numbers that:
- Multiply to 6 (the constant)
- Add to 5 (the coefficient of x)
Those numbers are 2 and 3!
So: x² + 5x + 6 = (x + 2)(x + 3)

**The Difference of Squares:**
x² - 9 = (x + 3)(x - 3)
This is because (x + 3)(x - 3) = x² - 3x + 3x - 9 = x² - 9

**Practice:**
Factor: x² + 7x + 12
Answer: (x + 3)(x + 4) because 3 × 4 = 12 and 3 + 4 = 7

Well done! You're becoming an algebra expert!`,
    },
  ],
  Science: [
    {
      day: 1n,
      title: "Introduction to Cells",
      subject: "Science",
      grade: 8n,
      content: `Welcome to Biology! Today we discover the building block of all life — the Cell!

**What is a Cell?**
A cell is the smallest unit of life. All living things are made of cells. Cells carry out all the processes that keep organisms alive.

**Two Main Types of Cells:**
1. **Prokaryotic Cells** — Simple cells without a nucleus (bacteria)
2. **Eukaryotic Cells** — Complex cells with a nucleus (plants, animals, fungi)

**Key Parts of an Animal Cell:**
- **Cell Membrane:** Controls what enters and exits the cell
- **Nucleus:** The control center — contains DNA
- **Cytoplasm:** Jelly-like fluid that fills the cell
- **Mitochondria:** The powerhouse — produces energy (ATP)
- **Ribosomes:** Make proteins

**Key Parts of a Plant Cell (Additional):**
- **Cell Wall:** Provides structural support (made of cellulose)
- **Chloroplasts:** Perform photosynthesis (contain chlorophyll)
- **Vacuole:** Large central vacuole stores water and nutrients

**Fun Fact:**
The human body contains about 37 trillion cells! Each cell is so small that 10,000 cells could fit on a pin head.

**Remember:** Animal cells don't have cell walls or chloroplasts — that's a key difference!`,
    },
    {
      day: 2n,
      title: "Photosynthesis",
      subject: "Science",
      grade: 8n,
      content: `Today we learn one of the most important processes on Earth — Photosynthesis!

**What is Photosynthesis?**
Photosynthesis is how plants make their own food using sunlight. It happens mainly in the leaves.

**The Photosynthesis Equation:**
6CO₂ + 6H₂O + Light Energy → C₆H₁₂O₆ + 6O₂
(Carbon dioxide + Water + Sunlight → Glucose + Oxygen)

**Where Does it Happen?**
In the chloroplasts — the green organelles in plant cells. Chloroplasts contain chlorophyll, the green pigment that absorbs sunlight.

**Two Stages of Photosynthesis:**
1. **Light Reactions:** Sunlight is captured and water is split, releasing oxygen
2. **Calvin Cycle (Dark Reactions):** CO₂ is converted into glucose using the energy captured

**Factors Affecting Photosynthesis:**
- Light intensity (more light = faster photosynthesis)
- Carbon dioxide concentration
- Temperature (enzyme activity)
- Water availability

**Why Is It Important?**
- Produces oxygen for all living things to breathe
- Creates food (glucose) that supports entire food chains
- Removes CO₂ from the atmosphere

**Fun Fact:** One large tree can produce enough oxygen for 4 people to breathe for a full year!`,
    },
    {
      day: 3n,
      title: "Force and Motion",
      subject: "Science",
      grade: 8n,
      content: `Today we explore the fascinating world of Force and Motion — the science of why things move!

**What is Force?**
A force is a push or pull that acts on an object. Forces can change an object's:
- Speed (make it faster or slower)
- Direction (change which way it moves)
- Shape (squash or stretch it)

**Newton's Three Laws of Motion:**

**Law 1 - Inertia:**
An object at rest stays at rest, and an object in motion stays in motion, unless acted upon by an external force.
Example: A soccer ball doesn't move until you kick it!

**Law 2 - F = ma:**
Force = Mass × Acceleration
The more massive an object, the more force needed to accelerate it.
Example: It's harder to push a car than a bicycle.

**Law 3 - Action-Reaction:**
For every action, there is an equal and opposite reaction.
Example: When you jump, you push down on the Earth, and the Earth pushes you up!

**Types of Forces:**
- Gravity (pulls objects toward Earth)
- Friction (opposes motion between surfaces)
- Applied force (direct push or pull)
- Normal force (perpendicular to a surface)

**Real-World Application:**
Rockets work using Newton's 3rd Law — hot gases shoot downward, pushing the rocket upward!`,
    },
  ],
  English: [
    {
      day: 1n,
      title: "Parts of Speech",
      subject: "English",
      grade: 8n,
      content: `Welcome to English Grammar! Today we master the Parts of Speech — the building blocks of every sentence!

**What are Parts of Speech?**
Every word in the English language belongs to a category called a "part of speech." There are 8 main parts of speech.

**The 8 Parts of Speech:**

1. **Noun** — A person, place, thing, or idea
   Examples: teacher, Chennai, book, happiness

2. **Pronoun** — Replaces a noun
   Examples: he, she, it, they, we, I, you

3. **Verb** — An action or state of being
   Examples: run, jump, is, think, sing

4. **Adjective** — Describes a noun or pronoun
   Examples: big, red, fast, beautiful, smart

5. **Adverb** — Describes a verb, adjective, or another adverb
   Examples: quickly, very, always, never, there

6. **Preposition** — Shows relationship between words
   Examples: in, on, at, by, with, under, above

7. **Conjunction** — Joins words or clauses
   Examples: and, but, or, so, because, although

8. **Interjection** — Expresses strong emotion
   Examples: Wow! Ouch! Hurray! Oh no!

**Practice Sentence:**
"The clever student quickly solved the difficult problem."
- The = Article (type of adjective)
- clever = Adjective
- student = Noun
- quickly = Adverb
- solved = Verb
- difficult = Adjective
- problem = Noun`,
    },
    {
      day: 2n,
      title: "Tenses and Verb Forms",
      subject: "English",
      grade: 8n,
      content: `Today we explore Tenses — how verbs tell us WHEN something happens!

**The Three Main Tenses:**

**1. Present Tense** — Happening now or regularly
- Simple Present: I eat breakfast every day.
- Present Continuous: I am eating breakfast now.
- Present Perfect: I have eaten breakfast already.

**2. Past Tense** — Already happened
- Simple Past: I ate breakfast this morning.
- Past Continuous: I was eating when you called.
- Past Perfect: I had eaten before you arrived.

**3. Future Tense** — Will happen
- Simple Future: I will eat breakfast tomorrow.
- Future Continuous: I will be eating at 8 AM.
- Future Perfect: I will have eaten by 9 AM.

**Regular vs. Irregular Verbs:**
Regular verbs follow a pattern: walk → walked → walked
Irregular verbs change form: eat → ate → eaten

**Common Irregular Verbs:**
| Base | Past | Past Participle |
|------|------|----------------|
| go | went | gone |
| see | saw | seen |
| write | wrote | written |
| run | ran | run |

**Time Markers Help Identify Tense:**
- Present: now, today, always, usually
- Past: yesterday, last week, ago
- Future: tomorrow, next week, soon

**Practice:** Convert to Past Tense:
"She plays cricket every Sunday."
Answer: "She played cricket last Sunday."`,
    },
    {
      day: 3n,
      title: "Essay Writing Techniques",
      subject: "English",
      grade: 8n,
      content: `Today we learn how to write a powerful essay that impresses readers!

**What is an Essay?**
An essay is a piece of writing that presents your ideas about a topic in an organized way.

**The Three-Part Structure:**

**1. Introduction (Opening Paragraph)**
- Start with a hook (interesting sentence)
- Provide background information
- End with a thesis statement (main argument)

Example Hook: "Imagine a world where nobody could read or write — how different life would be!"

**2. Body Paragraphs (Middle Section)**
Each paragraph should:
- Start with a topic sentence (main idea)
- Include supporting details and examples
- Use transition words (Furthermore, In addition, However)
- End with a concluding sentence

**Transition Words:**
- Adding ideas: Furthermore, Moreover, In addition
- Contrasting: However, On the other hand, Despite
- Concluding: Therefore, As a result, In conclusion

**3. Conclusion (Final Paragraph)**
- Restate the thesis in new words
- Summarize main points
- End with a strong final thought

**Types of Essays:**
- Narrative: Tells a story (I, me, my)
- Descriptive: Paints a picture with words
- Expository: Explains information
- Persuasive/Argumentative: Convinces the reader

**Golden Rules of Good Writing:**
✓ Plan before you write
✓ Use specific examples
✓ Vary your sentence length
✓ Proofread your work!`,
    },
  ],
  Tamil: [
    {
      day: 1n,
      title: "தமிழ் இலக்கணம் - Introduction to Tamil Grammar",
      subject: "Tamil",
      grade: 8n,
      content: `வணக்கம்! Welcome to Tamil! Today we begin our journey into the beautiful Tamil language.

**About Tamil:**
Tamil is one of the world's oldest classical languages, with a history of over 2,000 years. It is spoken by over 75 million people worldwide and is the official language of Tamil Nadu.

**Tamil Script Basics:**
Tamil has 12 vowels (உயிர் எழுத்து) and 18 consonants (மெய் எழுத்து).

**The 12 Vowels (உயிர் எழுத்துக்கள்):**
அ, ஆ, இ, ஈ, உ, ஊ, எ, ஏ, ஐ, ஒ, ஓ, ஔ

**Basic Greetings in Tamil:**
- நமஸ்தே / வணக்கம் = Hello/Greeting
- நன்றி = Thank you
- தயவு செய்து = Please
- மன்னிக்கவும் = Sorry/Excuse me

**Numbers 1-10 in Tamil:**
1 = ஒன்று, 2 = இரண்டு, 3 = மூன்று, 4 = நான்கு, 5 = ஐந்து
6 = ஆறு, 7 = ஏழு, 8 = எட்டு, 9 = ஒன்பது, 10 = பத்து

**Tamil Literature:**
Thirukkural (திருக்குறள்) by Thiruvalluvar is one of the greatest works of Tamil literature — 1330 couplets covering all aspects of life.

Famous Kural: "அகர முதல எழுத்தெல்லாம்; ஆதி பகவன் முதற்றே உலகு"
Meaning: "A" is the beginning of all letters, just as God is the beginning of the universe.

Practice writing the Tamil vowels daily to improve your handwriting!`,
    },
    {
      day: 2n,
      title: "Tamil Nouns and Pronouns",
      subject: "Tamil",
      grade: 8n,
      content: `Today we learn about Tamil Nouns and Pronouns — the foundation of Tamil sentences!

**Nouns in Tamil (பெயர்ச்சொல்):**
Nouns name people, places, and things.

**Examples:**
- மனிதன் = Man
- பெண் = Woman
- வீடு = House
- பள்ளி = School
- மரம் = Tree

**Tamil Pronouns (பிரதி பெயர்ச்சொல்):**

**First Person (I/We):**
- நான் = I
- நாம் / நாங்கள் = We

**Second Person (You):**
- நீ = You (informal)
- நீங்கள் = You (formal/plural)

**Third Person (He/She/It/They):**
- அவன் = He (young person)
- அவள் = She (young person)  
- அவர் = He/She (respectful)
- அது = It
- அவர்கள் = They (people)
- அவை = They (things)

**Simple Tamil Sentences:**
- நான் மாணவன். = I am a student.
- அவள் ஆசிரியை. = She is a teacher.
- அது ஒரு நாய். = It is a dog.
- நாங்கள் தமிழ் படிக்கிறோம். = We are studying Tamil.

Practice making 5 sentences using the pronouns you learned today!`,
    },
    {
      day: 3n,
      title: "Tamil Verbs and Tenses",
      subject: "Tamil",
      grade: 8n,
      content: `Today we explore Tamil Verbs and how to express time through tenses!

**What is a Verb (வினைச்சொல்)?**
A verb describes an action or state. In Tamil, verbs change based on tense and the subject.

**The Three Tenses in Tamil:**

**Present Tense (நிகழ்காலம்):**
படிக்கிறேன் = I am studying (right now)
சாப்பிடுகிறேன் = I am eating

**Past Tense (இறந்த காலம்):**
படித்தேன் = I studied
சாப்பிட்டேன் = I ate

**Future Tense (எதிர் காலம்):**
படிப்பேன் = I will study
சாப்பிடுவேன் = I will eat

**Common Action Verbs:**
- படிக்க = to study
- சாப்பிட = to eat
- ஓட = to run
- பேச = to speak
- எழுத = to write
- படிக்க = to read
- விளையாட = to play

**Verb Conjugation Example — படிக்க (to study):**
| Person | Present | Past | Future |
|--------|---------|------|--------|
| நான் | படிக்கிறேன் | படித்தேன் | படிப்பேன் |
| நீ | படிக்கிறாய் | படித்தாய் | படிப்பாய் |
| அவர் | படிக்கிறார் | படித்தார் | படிப்பார் |

**Practice Sentence Translation:**
"Yesterday, I studied Tamil at school."
நேற்று, நான் பள்ளியில் தமிழ் படித்தேன்.

Great progress! Keep practicing your Tamil every day!`,
    },
  ],
  "Social Studies": [
    {
      day: 1n,
      title: "Ancient Civilizations",
      subject: "Social Studies",
      grade: 8n,
      content: `Welcome to Social Studies! Today we travel back in time to explore Ancient Civilizations!

**What is a Civilization?**
A civilization is an advanced society with organized government, culture, religion, and technology. The earliest civilizations emerged around river valleys.

**The Four River Valley Civilizations:**

**1. Mesopotamia (3500 BCE)**
- Location: Between Tigris and Euphrates Rivers (modern Iraq)
- Achievements: First writing system (Cuneiform), wheel, law (Code of Hammurabi)
- Famous: Hanging Gardens of Babylon

**2. Ancient Egypt (3100 BCE)**
- Location: Along the Nile River
- Achievements: Hieroglyphs, pyramids, mummies, calendar
- Famous: Pyramids of Giza, Sphinx, Tutankhamun

**3. Indus Valley Civilization (2600 BCE)**
- Location: Indus River (modern India/Pakistan)
- Achievements: Planned cities (Harappa, Mohenjo-daro), drainage systems, trade
- Famous: Uniform brick architecture, standardized weights

**4. Ancient China (2100 BCE)**
- Location: Yellow River (Huang He)
- Achievements: Silk, paper, compass, gunpowder, Great Wall
- Famous: Dynasties from Shang to Ming

**Why River Valleys?**
Rivers provided:
- Fresh water for drinking
- Fertile soil for farming (silt deposits)
- Transportation routes
- Fish for food

**India's Connection:**
The Indus Valley Civilization is one of India's greatest ancient civilizations, showing that India has been home to sophisticated societies for over 4,500 years!`,
    },
    {
      day: 2n,
      title: "Indian Independence Movement",
      subject: "Social Studies",
      grade: 8n,
      content: `Today we learn about one of history's greatest freedom struggles — India's Independence Movement!

**Background:**
Britain ruled India from 1757 to 1947 — nearly 200 years. The Indian National Congress (INC), founded in 1885, led the fight for freedom.

**Key Leaders:**

**Mahatma Gandhi (1869-1948)**
- Father of the Nation
- Strategy: Non-violence (Ahimsa) and Civil Disobedience
- Famous Movements: Non-Cooperation Movement (1920), Salt March (1930), Quit India Movement (1942)
- Quote: "Be the change you wish to see in the world"

**Jawaharlal Nehru (1889-1964)**
- First Prime Minister of India
- "Tryst with Destiny" speech on August 14, 1947

**Subhas Chandra Bose (1897-1945)**
- Led Indian National Army (INA)
- Slogan: "Give me blood and I will give you freedom!"

**Bal Gangadhar Tilak (1856-1920)**
- Slogan: "Swaraj is my birthright and I shall have it!"

**Key Events Timeline:**
- 1857: First War of Independence (Sepoy Mutiny)
- 1885: Indian National Congress founded
- 1919: Jallianwala Bagh Massacre
- 1930: Dandi Salt March (241 miles walk)
- 1942: Quit India Movement
- August 15, 1947: India gains Independence!

**The Salt March:**
Gandhi walked 240 miles from Sabarmati Ashram to Dandi beach to make salt — challenging the British salt tax. This sparked nationwide civil disobedience!

Remember: India's freedom was won through courage, sacrifice, and the determination of millions of ordinary citizens!`,
    },
    {
      day: 3n,
      title: "Map Reading and Geography",
      subject: "Social Studies",
      grade: 8n,
      content: `Today we learn the essential skill of Map Reading and Geography!

**What is a Map?**
A map is a flat representation of Earth's surface or part of it. Maps help us understand location, direction, distance, and features of places.

**Types of Maps:**
1. **Political Map** — Shows countries, states, and boundaries
2. **Physical Map** — Shows mountains, rivers, and natural features
3. **Climate Map** — Shows weather patterns and climate zones
4. **Road Map** — Shows roads, highways, and transportation
5. **Population Map** — Shows where people live

**Essential Map Components (MAP SKILLS):**

**Title:** Tells you what the map is about

**Scale:** Shows the relationship between map distance and real distance
Example: 1 cm = 100 km

**Legend/Key:** Explains symbols and colors used
- Blue = Water
- Green = Forests
- Brown = Mountains
- Yellow = Deserts

**Compass Rose:** Shows directions (North, South, East, West)
- NEVER EAT SHREDDED WHEAT = N, E, S, W (clockwise)

**Grid/Coordinates (Latitude & Longitude):**
- Latitude: Horizontal lines (parallel to equator), measured in degrees N or S
- Longitude: Vertical lines (meridians), measured in degrees E or W
- The equator is 0° latitude
- Prime Meridian (Greenwich) is 0° longitude

**Finding India on the Map:**
India is located between approximately:
- Latitude: 8°N to 37°N
- Longitude: 68°E to 97°E

**Practice:** Find the coordinates of your city using an atlas!`,
    },
  ],
};

export const SAMPLE_QUIZ_QUESTIONS: Record<string, QuizQuestion[]> = {
  Math: [
    {
      question: "What is the value of x in the equation: 3x + 6 = 18?",
      subject: "Math",
      grade: 8n,
      correctIndex: 1n,
      explanation: "3x = 18 - 6 = 12, so x = 12 ÷ 3 = 4",
      options: ["3", "4", "5", "6"],
    },
    {
      question: "Which of the following is a quadratic expression?",
      subject: "Math",
      grade: 8n,
      correctIndex: 2n,
      explanation: "A quadratic expression contains a variable squared (x²). Option C has x².",
      options: ["3x + 5", "4x - 2", "x² + 5x + 6", "2x + 7"],
    },
    {
      question: "What is the area of a rectangle with length 8 cm and width 5 cm?",
      subject: "Math",
      grade: 8n,
      correctIndex: 0n,
      explanation: "Area = length × width = 8 × 5 = 40 cm²",
      options: ["40 cm²", "26 cm²", "13 cm²", "45 cm²"],
    },
    {
      question: "Simplify: 5x + 3x - 2x",
      subject: "Math",
      grade: 8n,
      correctIndex: 1n,
      explanation: "Combine like terms: 5x + 3x - 2x = (5 + 3 - 2)x = 6x",
      options: ["4x", "6x", "8x", "10x"],
    },
    {
      question: "What is 15% of 200?",
      subject: "Math",
      grade: 8n,
      correctIndex: 2n,
      explanation: "15% of 200 = (15/100) × 200 = 0.15 × 200 = 30",
      options: ["20", "25", "30", "35"],
    },
  ],
  Science: [
    {
      question: "Which organelle is known as the 'powerhouse of the cell'?",
      subject: "Science",
      grade: 8n,
      correctIndex: 0n,
      explanation: "The mitochondria produces ATP (energy) for the cell, earning it the nickname 'powerhouse of the cell'.",
      options: ["Mitochondria", "Nucleus", "Ribosome", "Chloroplast"],
    },
    {
      question: "What is the correct equation for photosynthesis?",
      subject: "Science",
      grade: 8n,
      correctIndex: 1n,
      explanation: "Photosynthesis: 6CO₂ + 6H₂O + Light → C₆H₁₂O₆ + 6O₂",
      options: [
        "CO₂ + H₂O → O₂ + Glucose",
        "6CO₂ + 6H₂O + Light → C₆H₁₂O₆ + 6O₂",
        "Glucose + O₂ → CO₂ + H₂O",
        "H₂O + O₂ → CO₂ + Glucose",
      ],
    },
    {
      question: "Newton's Second Law states that Force equals:",
      subject: "Science",
      grade: 8n,
      correctIndex: 2n,
      explanation: "Newton's Second Law: F = ma (Force = Mass × Acceleration)",
      options: ["Mass + Acceleration", "Mass ÷ Acceleration", "Mass × Acceleration", "Acceleration ÷ Mass"],
    },
    {
      question: "Which part of the plant cell is responsible for photosynthesis?",
      subject: "Science",
      grade: 8n,
      correctIndex: 3n,
      explanation: "Chloroplasts contain chlorophyll and are the sites of photosynthesis in plant cells.",
      options: ["Mitochondria", "Vacuole", "Cell Wall", "Chloroplast"],
    },
    {
      question: "What type of cell does NOT have a membrane-bound nucleus?",
      subject: "Science",
      grade: 8n,
      correctIndex: 0n,
      explanation: "Prokaryotic cells (like bacteria) lack a membrane-bound nucleus. Eukaryotic cells have a nucleus.",
      options: ["Prokaryotic", "Eukaryotic", "Animal", "Plant"],
    },
  ],
  English: [
    {
      question: "Identify the part of speech of the underlined word: 'She runs QUICKLY.'",
      subject: "English",
      grade: 8n,
      correctIndex: 1n,
      explanation: "Quickly describes how she runs (a verb), so it is an adverb.",
      options: ["Adjective", "Adverb", "Noun", "Verb"],
    },
    {
      question: "Which sentence is in Past Perfect Tense?",
      subject: "English",
      grade: 8n,
      correctIndex: 2n,
      explanation: "Past Perfect = had + past participle. 'She had finished her homework' is past perfect.",
      options: [
        "She is finishing her homework.",
        "She finished her homework.",
        "She had finished her homework.",
        "She will finish her homework.",
      ],
    },
    {
      question: "What is the conjunction in: 'I wanted to play, BUT it was raining.'?",
      subject: "English",
      grade: 8n,
      correctIndex: 0n,
      explanation: "BUT is a coordinating conjunction that connects two contrasting clauses.",
      options: ["But", "Play", "Raining", "Wanted"],
    },
    {
      question: "Which part of an essay presents the main argument?",
      subject: "English",
      grade: 8n,
      correctIndex: 1n,
      explanation: "The thesis statement in the introduction presents the main argument of the essay.",
      options: ["Hook", "Thesis Statement", "Conclusion", "Body Paragraph"],
    },
    {
      question: "What literary device uses 'the moon smiled down at us'?",
      subject: "English",
      grade: 8n,
      correctIndex: 3n,
      explanation: "Personification attributes human qualities (smiling) to non-human things (the moon).",
      options: ["Simile", "Metaphor", "Alliteration", "Personification"],
    },
  ],
  Tamil: [
    {
      question: "How many vowels (உயிர் எழுத்துக்கள்) are there in Tamil?",
      subject: "Tamil",
      grade: 8n,
      correctIndex: 1n,
      explanation: "Tamil has 12 vowels (உயிர் எழுத்துக்கள்): அ, ஆ, இ, ஈ, உ, ஊ, எ, ஏ, ஐ, ஒ, ஓ, ஔ",
      options: ["10", "12", "18", "24"],
    },
    {
      question: "What does 'நன்றி' mean in English?",
      subject: "Tamil",
      grade: 8n,
      correctIndex: 0n,
      explanation: "நன்றி means 'Thank you' in Tamil.",
      options: ["Thank you", "Hello", "Goodbye", "Sorry"],
    },
    {
      question: "Who wrote the Thirukkural (திருக்குறள்)?",
      subject: "Tamil",
      grade: 8n,
      correctIndex: 2n,
      explanation: "Thiruvalluvar wrote the Thirukkural, one of the greatest works of Tamil literature.",
      options: ["Kambar", "Avvaiyar", "Thiruvalluvar", "Ilango"],
    },
    {
      question: "What is 'நான்' in English?",
      subject: "Tamil",
      grade: 8n,
      correctIndex: 1n,
      explanation: "நான் is the Tamil word for 'I' (first person singular pronoun).",
      options: ["We", "I", "You", "They"],
    },
    {
      question: "Which tense is used in: 'நான் படிக்கிறேன்'?",
      subject: "Tamil",
      grade: 8n,
      correctIndex: 0n,
      explanation: "படிக்கிறேன் is present tense. It means 'I am studying' right now.",
      options: ["Present Tense", "Past Tense", "Future Tense", "Imperative"],
    },
  ],
  "Social Studies": [
    {
      question: "Which river valley civilization invented the first writing system (Cuneiform)?",
      subject: "Social Studies",
      grade: 8n,
      correctIndex: 0n,
      explanation: "Mesopotamia (between Tigris and Euphrates rivers) invented Cuneiform writing around 3500 BCE.",
      options: ["Mesopotamia", "Egypt", "Indus Valley", "China"],
    },
    {
      question: "On which date did India gain independence?",
      subject: "Social Studies",
      grade: 8n,
      correctIndex: 1n,
      explanation: "India gained independence from British rule on August 15, 1947.",
      options: ["January 26, 1950", "August 15, 1947", "October 2, 1869", "March 12, 1930"],
    },
    {
      question: "What does the scale on a map represent?",
      subject: "Social Studies",
      grade: 8n,
      correctIndex: 2n,
      explanation: "The scale shows the relationship between distances on the map and actual distances on Earth.",
      options: [
        "The age of the map",
        "The colors used in the map",
        "The relationship between map distance and real distance",
        "The political boundaries",
      ],
    },
    {
      question: "What was Gandhi's famous 1930 march called?",
      subject: "Social Studies",
      grade: 8n,
      correctIndex: 3n,
      explanation: "Gandhi's 241-mile march to Dandi beach in 1930 to protest the British salt tax is called the Salt March (Dandi March).",
      options: ["Quit India March", "Non-Cooperation March", "Swadeshi March", "Salt March (Dandi March)"],
    },
    {
      question: "What is the equator's latitude?",
      subject: "Social Studies",
      grade: 8n,
      correctIndex: 0n,
      explanation: "The equator is the imaginary line at 0° latitude that divides the Earth into Northern and Southern hemispheres.",
      options: ["0°", "23.5° N", "90° N", "45° S"],
    },
  ],
};
