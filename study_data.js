// Study Guide Content Data Source (Refining to match 100% of Revised PDF Document)
const STUDY_DATA = {
  general: {
    title: "Title I Paraprofessional Assessment Study Guide",
    subtitle: "Focus: Foundational Academic Skills & K-3 Instructional Scenarios",
    welcome: "Welcome! This study guide is designed to help you prepare for the Title I Paraprofessional Assessment. To meet the \"Highly Qualified\" standard, paraeducators must demonstrate two things:",
    coreCompetencies: [
      {
        num: 1,
        title: "Personal Proficiency",
        desc: "A solid grasp of foundational reading, writing, and math skills."
      },
      {
        num: 2,
        title: "Instructional Capability",
        desc: "The ability to effectively assist early childhood and lower-elementary students (Kindergarten through 3rd grade) in learning these skills."
      }
    ],
    modulesSummary: [
      {
        id: "reading",
        title: "Part 1: The Reading Module",
        icon: "book-open",
        color: "blue",
        foundational: [
          { title: "Reading Comprehension (Main Idea & Details)", desc: "Identify the primary point of a passage and locate specific details that support that point." },
          { title: "Vocabulary & Context Clues", desc: "Define words (like <em>ambiguous</em> or <em>substantiate</em>) based on surrounding text clues." },
          { title: "Fact vs. Opinion", desc: "A <strong>fact</strong> can be proven true/false (\"The MSDS sheets are in the office\"); an <strong>opinion</strong> expresses belief/feeling (\"Cleaning a spill is the hardest job\")." },
          { title: "Author's Tone & Purpose", desc: "Pay attention to how text is written: instructional (giving directions), persuasive (convincing), or narrative (storytelling)." }
        ],
        scenarios: [
          { title: "Phonemic Awareness (Kindergarten)", desc: "Hear and manipulate individual sounds (phonemes) in spoken words. Segmenting \"cat\" -> /k/ - /a/ - /t/, not letter names (C-A-T)." },
          { title: "Decoding Strategies (K-1st Grade)", desc: "Prompt phonic decoding (\"What sound does the first letter make?\") and visual cues (\"Let's look at the picture for a clue\"). Do not just read it for them." },
          { title: "Fluency Interventions (1st-2nd Grade)", desc: "Fluency is reading at a steady, conversational pace. Use Choral Reading, Echo Reading, or Repeated Reading (3-5 times)." },
          { title: "Reading Comprehension Strategies (1st-3rd Grade)", desc: "Predicting (using title/cover picture) and Fix-up Strategies (stop, slowly reread, and verbally summarize)." },
          { title: "Text Features & Reference Tools (2nd-3rd Grade)", desc: "Glossary (mini-dictionary at back for words like \"habitat\"), Index, and Thesaurus (synonyms and antonyms)." },
          { title: "Figurative Language", desc: "Explain similes (\"as fast as a rocket\") so children understand speed comparison rather than literal rockets." }
        ]
      },
      {
        id: "writing",
        title: "Part 2: The Writing Module",
        icon: "edit-3",
        color: "emerald",
        foundational: [
          { title: "Subject-Verb Agreement", desc: "Singular subjects need singular verbs; plural subjects need plural verbs (\"The class has decided to play a game\")." },
          { title: "Pronoun-Antecedent Agreement", desc: "Match pronouns in number and gender (\"Each of the girls brought her own lunch\"). Note test vs. modern conversational standards." },
          { title: "Sentence Structure (Fragments & Run-ons)", desc: "A complete sentence needs a subject and verb. Avoid Fragments (\"Waiting for the school bus...\") and Comma Splices." },
          { title: "Punctuation & Capitalization", desc: "Apostrophes for possession (the teachers' lounge) and contractions. Capitalize proper nouns, not general seasons or locations (unless part of specific names like Canon City Public Library)." },
          { title: "Modifiers", desc: "Ensure descriptive phrases are placed next to the noun described (\"Exhausted from the playground, the bell rang\" -> student was exhausted)." },
          { title: "Commonly Confused Words", desc: "Affect (verb = influence) vs. Effect (noun = result)." }
        ],
        scenarios: [
          { title: "The Writing Process", desc: "Pre-writing (Brainstorming with guiding questions & graphic organizers like Web/Think Sheet), Drafting (Inventive spelling \"kat\"/\"fone\"), Revising (Content & organization) vs. Editing (Mechanics)." },
          { title: "Supporting English Learners (EL)", desc: "Allow EL students to draw pictures of their story first, then help label key items in English or allow dictation (transcribing)." },
          { title: "Constructive Feedback & Rubrics", desc: "Do not cover paper in red ink; focus on 1-2 lesson objectives. Use teacher rubrics/checklists for \"Am I done?\"" },
          { title: "Peer Review", desc: "Provide high structure for young students (\"one thing liked and one question about what happens next\")." }
        ]
      },
      {
        id: "math",
        title: "Part 3: The Math Module",
        icon: "cpu",
        color: "amber",
        foundational: [
          { title: "Order of Operations (PEMDAS)", desc: "Parentheses, Exponents, Multiplication & Division (left to right), Addition & Subtraction (left to right). Example: 8 + 4 x 3 - 2 = 18." },
          { title: "Fractions & Percentages", desc: "Find common denominators (1/3 + 2/5 = 5/15 + 6/15 = 11/15). Calculate 20% discount on $300 ($300 - $60 = $240)." },
          { title: "Basic Algebra & Geometry", desc: "Isolate variable x (3x - 5 = 16 -> x = 7). Area = Length x Width (12ft x 9ft = 108 sq ft). Perimeter = sum of sides (40+40+30+30 = 140 ft)." },
          { title: "Statistics & Ratios", desc: "Mean/Average = sum divided by count (80, 90, 85, 95 -> 87.5). Ratios/Proportions (2 cups flour for 3 batches -> 6 cups for 9 batches)." }
        ],
        scenarios: [
          { title: "Visual Models & Manipulatives", desc: "Ten-Frames (bridge to 10 for 8+5=13), Base-Ten Blocks (\"2\" in 25 means 20), Fraction Tiles/Circles (1/2 equals 2/4 visually)." },
          { title: "Word Problem Strategies", desc: "Read aloud together, underline what question asks to find, visualize story." },
          { title: "Checking for Understanding", desc: "Avoid the \"Nodding Trap\". Have the student talk you through their steps out loud (\"teach it back\")." },
          { title: "Error Analysis", desc: "Diagnose root cause of errors: Subtraction Regrouping Error (52 - 18 = 44) and Multiplication Place Value Error (14 x 3 = 312)." },
          { title: "Math Anxiety (Chunking)", desc: "Cover up the rest of the worksheet with blank paper to focus on step one of problem one." }
        ]
      }
    ],
    testTips: [
      {
        title: "Focus on the Process, Not Just the Answer",
        desc: "For scenario questions, the test wants to see if you can guide a student to discover the answer themselves. Choose options that involve prompting, questioning, and the use of visual tools rather than just giving the student the answer."
      },
      {
        title: "Read Carefully",
        desc: "Watch out for negative phrasing like \"Which of the following is NOT...\" or \"Identify the sentence with an error.\""
      },
      {
        title: "Pace Yourself",
        desc: "You have as much time as you need. Use scratch paper for the math problems and double-check your arithmetic!"
      }
    ]
  },

  reading: {
    title: "Title I Paraprofessional Assessment: Expanded Reading Module",
    subtitle: "Focus: Foundational Reading Comprehension & K-3 Literacy Instruction",
    intro: "Welcome to the expanded Reading Module. As a Title I paraprofessional working in early elementary education (Grades K-3), you are at the forefront of helping children transition from \"learning to read\" to \"reading to learn.\"\n\nTo be effective, you must demonstrate two core competencies. First, you need a strong personal command of reading comprehension and analysis (Personal Proficiency). Second, you must understand the developmental stages of early literacy and know how to guide young readers through them without simply giving them the answers (Instructional Capability).",
    part1: {
      title: "Part 1: Foundational Reading Skills (Personal Proficiency)",
      subtitle: "Evaluating adult-level passage comprehension and analysis.",
      topics: [
        {
          id: "r1-1",
          title: "1. Main Idea and Supporting Details",
          content: "The <strong>main idea</strong> is the central point the author makes. It is what the passage is mostly about. <strong>Supporting details</strong> are the specific facts, examples, or reasons that back up the main idea.",
          testTip: "Tip for the Test: The main idea is frequently stated in the first sentence (topic sentence) or the last sentence (concluding sentence) of a paragraph. Ask yourself, \"If I had to summarize this paragraph in one sentence, what would I say?\"",
          example: "Example: If a paragraph describes the life cycle of a butterfly, the diet of a caterpillar, and the migration patterns of monarchs, the main idea is \"The characteristics and life cycle of butterflies,\" while the specific diet is just a supporting detail."
        },
        {
          id: "r1-2",
          title: "2. Making Inferences (Reading Between the Lines)",
          content: "An inference is an educated guess based on evidence from the text combined with your own background knowledge. The author won't tell you the answer directly; you have to deduce it.",
          textSample: "Text: \"Sam sighed, closed his heavy textbook, rubbed his eyes, and looked at the clock. It was 2:00 AM.\"",
          inferenceSample: "Inference: Sam is tired and has been studying for a long time. The text never says \"Sam is tired,\" but the clues (rubbing eyes, late hour, heavy textbook) lead you to that conclusion."
        },
        {
          id: "r1-3",
          title: "3. Vocabulary and Context Clues",
          content: "You will encounter words you might not know, but the surrounding text will provide clues to their meaning.",
          types: [
            { name: "Definition/Explanation Clues", text: "Sometimes the author defines the word right after using it. \"The instructions were ambiguous, or unclear, leading to confusion.\"" },
            { name: "Synonym Clues", text: "Words with similar meanings are used nearby. \"The girl was timid; she was so shy she hid behind her mother.\"" },
            { name: "Antonym Clues", text: "Words with opposite meanings are used to show contrast. \"Unlike her loud, outgoing sister, Maria was very introverted.\"" }
          ]
        },
        {
          id: "r1-4",
          title: "4. Fact vs. Opinion",
          content: "Learn to distinguish objective facts from subjective opinions:",
          facts: ["Fact: A statement that can be proven true or false through objective evidence. (e.g., \"The library opens at 8:00 AM.\")"],
          opinions: ["Opinion: A statement that expresses a belief, feeling, or judgment. Watch for \"value words\" like best, worst, beautiful, should, hardest, or unfair. (e.g., \"The library is the best place in the school.\")"]
        },
        {
          id: "r1-5",
          title: "5. Author's Purpose (PIE)",
          content: "Why did the author write the passage? Think of the acronym <strong>PIE</strong>:",
          pie: [
            { letter: "P", name: "Persuade", desc: "To convince the reader to do or believe something (e.g., an editorial about why the school needs a new playground)." },
            { letter: "I", name: "Inform", desc: "To give facts, directions, or instructional information (e.g., a science textbook, an MSDS chemical sheet, a recipe)." },
            { letter: "E", name: "Entertain", desc: "To tell a story for enjoyment (e.g., a fictional narrative about a dragon)." }
          ]
        },
        {
          id: "r1-6",
          title: "6. Text Structure",
          content: "Pay attention to how a passage is organized:",
          structures: [
            { name: "Chronological / Sequence", desc: "Arranged by time (first, next, then, finally)." },
            { name: "Cause and Effect", desc: "Shows how one event makes another event happen (because, therefore, as a result)." },
            { name: "Problem and Solution", desc: "Presents an issue and how it was fixed." },
            { name: "Compare and Contrast", desc: "Shows how two things are alike and different (similarly, on the other hand)." }
          ]
        }
      ]
    },
    part2: {
      title: "Part 2: K-3 Reading Instructional Scenarios (Instructional Skills)",
      subtitle: "This section focuses on how to teach reading. In K-3, paraprofessionals work with students at highly varied skill levels.",
      topics: [
        {
          id: "r2-1",
          title: "1. Phonological vs. Phonemic Awareness (Pre-K to 1st Grade)",
          content: "These terms are often confused, but they are crucial for early literacy. Both are <strong>auditory skills</strong>. You can do them completely in the dark—no letters involved!",
          points: [
            "<strong>Phonological Awareness</strong>: The broad umbrella term for recognizing sounds in spoken language. This includes clapping out syllables (bas-ket-ball), recognizing rhyming words (cat/hat), and identifying the first sound in a word.",
            "<strong>Phonemic Awareness</strong>: A specific, more advanced sub-skill under that umbrella. It is the ability to hear, isolate, and manipulate the <em>individual</em> sounds (phonemes) in spoken words.",
            "<strong>Example Task</strong>: If you ask a student to segment the spoken word \"dog,\" they should say the sounds /d/ - /o/ - /g/. They should <strong>not</strong> say the letter names (D-O-G)."
          ]
        },
        {
          id: "r2-2",
          title: "2. Phonics & Decoding (K-2nd Grade)",
          content: "Phonics is the bridge between sounds (phonemes) and written letters (graphemes). When a student is reading a book and gets stuck on an unknown word:",
          approaches: [
            { type: "Ineffective Approach", text: "Just reading the word to them or telling them to guess randomly based on the picture." },
            { type: "Effective Scaffolding", text: "Prompt them to decode (sound it out). \"Let's point to the first letter. What sound does that make? Good, now what sound does the next letter make? Let's blend them together.\"" },
            { type: "Blending vs. Segmenting", text: "<em>Blending</em> is squishing sounds together to read a word (c-a-t -> cat). <em>Segmenting</em> is pulling a word apart into sounds to spell it (cat -> c-a-t)." }
          ]
        },
        {
          id: "r2-3",
          title: "3. Sight Words / High-Frequency Words",
          content: "These are words that appear constantly in early text (the, said, was, of). Many of them cannot be easily \"sounded out\" because they break standard phonics rules.",
          points: [
            "<strong>Paraeducator Role</strong>: Assist with fluency through repetition. You might use flashcards, word walls, or a strategy called \"heart words\" (where the student sounds out the regular parts of the word but draws a heart above the tricky part they have to memorize by heart, like the \"ai\" in \"said\")."
          ]
        },
        {
          id: "r2-4",
          title: "4. Reading Fluency (1st-3rd Grade)",
          content: "Fluency is reading like you talk. A fluent reader doesn't sound like a robot. Fluency has three components:",
          components: [
            { name: "1. Accuracy", desc: "Reading the words correctly." },
            { name: "2. Rate", desc: "Reading at an appropriate speed (not too slow, not racing)." },
            { name: "3. Prosody", desc: "Reading with expression, changing tone for characters, and pausing appropriately at commas and periods." }
          ],
          interventions: [
            { name: "Choral Reading", desc: "The paraeducator and the student read the same text aloud together at the same time. This builds confidence." },
            { name: "Echo Reading", desc: "The paraeducator reads a sentence with great expression. The student then \"echoes\" it back, mimicking the pacing and tone." },
            { name: "Repeated Reading", desc: "The student reads the same passage 3 - 5 times. Each time the student should improve in accuracy, rate, and steadiness of pace." }
          ]
        },
        {
          id: "r2-5",
          title: "5. Reading Comprehension Strategies",
          content: "Just because a child can read the words out loud doesn't mean they understand what they are reading.",
          stages: [
            { stage: "Before Reading (Predicting)", desc: "Activate prior knowledge. Have the student look at the cover, title, and pictures. Ask, \"What do you think this book will be about?\"" },
            { stage: "During Reading (Visualizing)", desc: "Ask the student to paint a picture in their mind of what is happening." },
            { stage: "After Reading (Summarizing/Fix-Up Strategies)", desc: "If a student finishes a page and says, \"I don't remember what happened,\" give them a Fix-Up Strategy. Have them stop, slowly reread the page, and verbally summarize what happened after every paragraph using the 5 Ws (Who, What, Where, When, Why)." }
          ]
        },
        {
          id: "r2-6",
          title: "6. Reference Tools and Text Features (2nd-3rd Grade)",
          content: "Helping students navigate non-fiction texts.",
          tools: [
            { name: "Table of Contents", desc: "Found at the front; shows chapters and page numbers." },
            { name: "Glossary", desc: "A mini-dictionary at the back of a textbook. (e.g., If a student doesn't know what \"photosynthesis\" means in their science book, prompt them to check the glossary)." },
            { name: "Index", desc: "Found at the back; an alphabetical list of specific topics and the pages where they are mentioned." },
            { name: "Thesaurus", desc: "A tool used to find synonyms (words with similar meanings) or antonyms (words that mean the opposite)." }
          ]
        }
      ],
      scenarios: [
        {
          q: "1. A kindergarten student is looking at a picture book and stops at the word \"bat.\" They look frustrated and ask you what it says. What is the most pedagogically sound response?",
          correct: "Correct Approach: \"Let's look at the first letter. What sound does 'b' make? Now let's stretch out the rest of the sounds and blend them together.\"",
          why: "Why: Giving them the word doesn't teach them how to read. Prompting them to use phonics skills builds independence."
        },
        {
          q: "2. You are doing a reading intervention with a second-grade student who reads very accurately, but reads in a slow, robotic, monotone voice. What is the best strategy to use?",
          correct: "Correct Approach: Echo reading. You read a sentence with proper expression and pauses, and have the student repeat it back to you using the same voice.",
          why: "Why: The student has mastered accuracy, but lacks prosody (expression) and rate. Echo reading models what fluent reading sounds like."
        },
        {
          q: "3. A third-grade student is reading a chapter book. They finish a page, look up, and say, \"I have no idea what I just read.\" What should the paraeducator do?",
          correct: "Correct Approach: Tell the student to use a \"fix-up strategy\" by rereading the page slowly and stopping after each paragraph to verbally summarize what just happened.",
          why: "Why: Summarizing and chunking the text helps build active comprehension. Telling them to just keep reading will only increase their confusion."
        },
        {
          q: "4. While reading a story, a first-grade student points to a word and asks, \"Why is the word CRASH written in all capital letters?\" How should you explain this?",
          correct: "Correct Approach: Explain that the author is using onomatopoeia (a sound word) and capitalizing it to show the reader how loud the sound was in the story.",
          why: "Why: This teaches the student about the author's purpose and how text features inform expression and comprehension."
        }
      ],
      keyTakeaway: "Key Takeaway for the Exam: In K-3 reading scenarios, the right answer almost always involves <strong>prompting the student to use a strategy</strong> (sounding it out, looking for context clues, summarizing, making a prediction) rather than the adult doing the mental work for them."
    }
  },

  writing: {
    title: "Title I Paraprofessional Assessment: Expanded Writing Module",
    subtitle: "Focus: Foundational Grammar & K-3 Writing Instruction Strategies",
    intro: "Welcome to the expanded Writing Module. As a Title I paraprofessional, your role in writing instruction is twofold. First, you must demonstrate a strong personal command of standard English conventions. Second, and perhaps more importantly, you must know how to effectively guide early childhood and lower-elementary students (Kindergarten through 3rd grade) through the writing process without simply doing the work for them.\n\nThis module is broken into two parts: Personal Proficiency (Foundational Skills) and Instructional Capability (Pedagogical Scenarios).",
    part1: {
      title: "Part 1: Foundational Writing Skills (Personal Proficiency)",
      subtitle: "The assessment will evaluate your grasp of basic grammar, mechanics, and syntax. You need to identify errors in sentences and choose the most effective way to communicate ideas.",
      topics: [
        {
          id: "w1-1",
          title: "1. Subject-Verb Agreement",
          content: "The basic rule is that a singular subject takes a singular verb, and a plural subject takes a plural verb.",
          examples: [
            "Singular: The dog (subject) runs (verb) in the yard.",
            "Plural: The dogs (subject) run (verb) in the yard."
          ],
          pitfalls: [
            { rule: "Phrases between the subject and verb", wrong: "Incorrect: The box of crayons belong on the desk. (The verb \"belong\" is incorrectly agreeing with \"crayons\").", right: "Correct: The box of crayons belongs on the desk." },
            { rule: "Indefinite Pronouns", wrong: "Words like everyone, everybody, each, anyone, someone are usually singular.", right: "Correct: Everyone in class is getting a sticker. (Not \"are\")." },
            { rule: "Collective Nouns", wrong: "Groups acting as a single unit take a singular verb.", right: "Correct: The class has decided to play a game. / Correct: The jury is reaching a verdict." }
          ]
        },
        {
          id: "w1-2",
          title: "2. Pronoun-Antecedent Agreement",
          content: "A pronoun (he, she, it, they) must match the noun it replaces (the antecedent) in number and gender.",
          examples: [
            "Incorrect: Each of the girls brought their own lunch. (Girls is plural, but \"each\" is singular, so \"their\" is incorrect).",
            "Correct: Each of the girls brought her own lunch.",
            "Correct: The school updated its policy on absences. (School is an \"it\", not a \"they\")."
          ],
          note: "Note: In modern conversational English, the singular \"they\" is widely accepted, but standardized tests often still require strict traditional agreement unless the gender of a singular individual is unknown or non-binary."
        },
        {
          id: "w1-3",
          title: "3. Sentence Structure (Fragments, Run-ons, and Comma Splices)",
          content: "A complete sentence requires a subject (who or what), a predicate/verb (action), and must express a complete thought.",
          details: [
            { type: "Fragments", ex: "Missing a core component or a complete thought. Complete sentences have two parts: a subject (tells who the sentence is about) and a predicate (describes the subject or tells what the subject does).\n1. Fragment: Waiting for the school bus in the pouring rain. (Who is waiting?)\n   Correction: The children were waiting for the school bus in the pouring rain.\n2. Fragment: Because the bell rang. (This is a dependent clause and needs an independent clause to finish the thought).\n   Correction: Because the bell rang, the students packed their bags." },
            { type: "Run-ons", ex: "Two independent clauses mashed together without punctuation.\n1. Incorrect: I love reading books it teaches me things." },
            { type: "Comma Splices", ex: "Using <em>only</em> a comma to join two complete sentences.\n1. Incorrect: The weather was freezing, we decided to go outside anyway." },
            { type: "Fixing Run-ons/Comma Splices", fix1: "1. Use a period: I love reading books. It teaches me things.", fix2: "2. Use a semicolon: The weather was freezing; we decided to go outside anyway.", fix3: "3. Use a comma and a conjunction (FANBOYS: for, and, nor, but, or, yet, so): The weather was freezing, but we decided to go outside anyway." }
          ]
        },
        {
          id: "w1-4",
          title: "4. Punctuation and Capitalization",
          rules: [
            { title: "Apostrophes: Used for two specific reasons", desc: "1. Contractions: To show missing letters (e.g., do not -> don't, they are -> they're).\n2. Possession: To show ownership.\n   - Singular owner: Add 's (The student's backpack).\n   - Plural owner ending in the letter s: Add an apostrophe after the letter s. (The teachers' lounge).\n   - Watch out for \"Its\" vs. \"It's\": \"It's\" means it is or it has. \"Its\" implies ownership (The dog lost its ball)." },
            { title: "Capitalization Rules - Do Capitalize", desc: "Proper nouns (names of specific people, places, things), days of the week, months, holidays, titles preceding names (President Washington)." },
            { title: "Capitalization Rules - Do NOT Capitalize", desc: "General seasons (fall, winter), directions (driving north), or general locations unless part of a specific name (e.g., \"I went to the library\" vs. \"I went to the Canon City Public Library\")." }
          ]
        },
        {
          id: "w1-5",
          title: "5. Misplaced and Dangling Modifiers",
          content: "A modifier is a word or phrase that describes something. It must be placed right next to the noun it is describing. If it's too far away (misplaced) or the noun is missing entirely (dangling), the sentence becomes confusing or unintentionally funny.",
          examples: [
            { wrong: "Dangling: Barking loudly, the boy chased the dog down the street. (Was the boy barking?)", right: "Correction: Barking loudly, the dog chased the ball down the street." },
            { wrong: "Dangling: Exhausted from the playground, the bell rang. (The bell wasn't exhausted).", right: "Correction: Exhausted from the playground, the student fell asleep during story time." }
          ]
        },
        {
          id: "w1-6",
          title: "6. Commonly Confused Words",
          words: [
            { pair: "Affect vs. Effect", desc: "Affect is usually a verb (action) meaning to influence. (\"The rain will affect our plans.\")\nEffect is usually a noun (thing) meaning the result. (\"The new policy had a positive effect.\")\nHint: Affect = Action." },
            { pair: "Their, There, They're", desc: "Their: Possession (That is their book).\nThere: Location (The book is over there).\nThey're: Contraction for \"they are\" (They're reading the book)." },
            { pair: "To, Too, Two", desc: "To: Direction or infinitive verb (Going to the store to buy milk).\nToo: Also, or excessively (I ate too much candy, and she did too).\nTwo: The number (I have two dogs)." }
          ]
        }
      ]
    },
    part2: {
      title: "Part 2: K-3 Writing Instructional Scenarios (Pedagogical Skills)",
      subtitle: "In the lower elementary grades, paraprofessionals are vital in helping students transition from oral language to written expression. The focus is on the process of writing and developing fluency, rather than demanding perfect mechanics on the first try.",
      topics: [
        {
          id: "w2-1",
          title: "1. Fine Motor Skills and \"Writing Readiness\" (Pre-K to Kindergarten)",
          content: "Before a child can write a paragraph, they must develop the physical ability to write.",
          activities: [
            "Role of the Paraeducator: Encourage activities that build small muscle strength in the hands and fingers.",
            "Pinching playdough or clay.",
            "Using tweezers to pick up small objects.",
            "Practicing proper pencil grip (tripod grasp).",
            "\"Writing\" in sensory bins (sand, shaving cream, or salt trays) before moving to paper."
          ]
        },
        {
          id: "w2-2",
          title: "2. The Writing Process: A Step-by-Step Guide",
          content: "The writing process is a cycle: Planning, Drafting, Revising, Editing, and Publishing.",
          steps: [
            { name: "A. Pre-writing / Planning (Brainstorming)", desc: "This is often the hardest part for young students. They may stare at a blank page and say, \"I don't know what to write.\"\n- Ineffective Approach: Telling the student what to write (e.g., \"Just write about a dog, that's easy.\") or making them look up definitions.\n- Effective Approach (Scaffolding): Help them make personal connections and organize their thoughts.\n  * Ask Guiding Questions: \"Tell me about...\" \"What do you like to do on the weekend?\" \"Do you have any pets at home?\"\n  * Use Graphic Organizers: Help them fill out a simple \"Web\" or \"Think Sheet\" (e.g., a circle in the middle with the topic, and spokes branching out with ideas).\n  * Drawing as Pre-writing: For K-1 students, drawing a detailed picture is pre-writing. The picture holds their story before they have the vocabulary to write." },
            { name: "B. Drafting (Getting Ideas Down)", desc: "The goal of the first draft is fluency—getting ideas out of the brain and onto the paper without stopping.\n- The Concept of \"Inventive Spelling\": Young students (K-1) should be encouraged to write the sounds they hear (e.g., writing \"kat\" for cat or \"fone\" for phone).\n- Why? If a student stops to ask \"how do you spell...\" every single word, they lose their train of thought, and their writing becomes disjointed and frustrating.\n- Paraeducator Response: If a student asks how to spell a word during a draft, prompt them: \"What sounds do you hear? Write those down and circle it so we can fix it later. Keep writing!\" Do not spell every word for them." },
            { name: "C. Revising vs. Editing (They are NOT the same thing!)", desc: "It is critical to know the difference on the assessment.\n- Revising (Content & Organization): This is about the \"meat\" of the story.\n  * Focus: Does it make sense? Is there a clear beginning, middle, and end? Are there good details? Does the topic sentence fit?\n  * Paraeducator Role: Ask, \"I noticed you added a puppy to the story, but where did he come from? What do you think you could add to explain that?\"\n- Editing (Mechanics): This is the final polish.\n  * Focus: Capital letters, punctuation, spelling (fixing inventive spelling words).\n  * Paraeducator Role: When pointing out errors on a rough draft, <strong>do not cover the paper in red ink</strong>. This is demoralizing. Instead, focus on one or two specific types of errors that align with the teacher's current lesson (e.g., \"Today, let's just hunt for missing capital letters at the beginning of our sentences.\")" },
            { name: "D. Publishing and Sharing", desc: "Creating an engaged community of writers means giving their writing an audience.\n- Peer Review: K-3 students need high structure to do this well. If a second grader just writes \"It is good\" on a partner's paper, guide them to use a specific framework (e.g., \"Tell your partner one specific thing you liked about their character, and ask one question about what happens next.\")\n- Using Rubrics: If a third-grader asks, \"Am I done?\" don't just say yes or no. Use the teacher's rubric (checklist). Say, \"Let's read your paper together and compare it to the checklist to see if you hit all the marks.\"" }
          ]
        },
        {
          id: "w2-3",
          title: "3. Supporting Specific Student Populations",
          populations: [
            { group: "English Learners (EL)", strategy: "An EL kindergarten student may have a brilliant story in their head but lack the English vocabulary to draft it.\n- Scaffolding Strategy: Allow them to draw the entire story first in detailed pictures. Then, sit with them and help them label key items in the picture using English words. You can also allow them to dictate the story to you while you write (transcribing) as a bridge to independent writing." },
            { group: "Students with Learning Disabilities", strategy: "For students who struggle with working memory or organization, break the writing task down into tiny, manageable \"chunks.\" If writing a whole paragraph is overwhelming, fold the paper or use a sticky note to cover everything except the very first sentence they need to write." }
          ]
        }
      ],
      scenarios: [
        {
          q: "1. A second-grade student is writing an informative paragraph about frogs. Their current first sentence is: \"Frogs are a thing.\" How should the paraeducator assist?",
          correct: "Correct Approach: Ask guiding questions to help them make it more specific. \"What kind of thing is a frog? An animal? An amphibian?",
          why: "Why: Guiding questions encourage student elaboration."
        },
        {
          q: "2. A first-grade student is writing a story but stops after every word to ask you how to spell it. How should the paraeducator respond to promote writing fluency?",
          correct: "Correct Approach: Tell them to write the sounds they hear (inventive spelling) and circle words they aren't sure about to fix later during the editing phase.",
          why: "Why: Encourages writing fluency and preserves train of thought."
        },
        {
          q: "3. You are helping a third-grade student with the Revising stage of their short story. Which of the following should you focus on?",
          correct: "Correct Approach: Ask the student whether their story has a clear beginning, middle, and end, and whether the events make sense. (Checking for periods and capitals is editing).",
          why: "Why: Revising targets content and structure, not mechanics."
        },
        {
          q: "4. A kindergarten student stops at a word they want to write, looks frustrated, and says, \"I can't do it.\" What is a helpful prompt?",
          correct: "Correct Approach: \"What are the sounds you hear in that word? Can you draw a picture of it first?\" (Avoid just telling them to copy a word from the board or writing it for them).",
          why: "Why: Scaffolds early writing through auditory listening and drawing."
        }
      ],
      keyTakeaway: "Key Takeaway for the Exam: When answering instructional scenario questions, always look for the option that involves <strong>prompting, questioning, scaffolding (like drawing or using graphic organizers), and preserving the student's train of thought</strong>. Avoid answers that have the adult doing the work for the student or demanding immediate perfection."
    }
  },

  math: {
    title: "Title I Paraprofessional Assessment: Expanded Math Module",
    subtitle: "Focus: Foundational Mathematics & K-3 Math Instruction Strategies",
    intro: "Welcome to the expanded Math Module. As a Title I paraprofessional working with early childhood and lower-elementary students (Kindergarten through 3rd grade), you play a crucial role in building foundational numeracy.\n\nTo be effective, you must demonstrate two core competencies. First, you need a strong personal command of foundational mathematics, ranging from basic arithmetic to early algebra and geometry (Personal Proficiency). Second, you must understand how young children conceptualize math and know how to guide them through problem-solving using visual tools and scaffolding (Instructional Capability).",
    part1: {
      title: "Part 1: Foundational Math Skills (Personal Proficiency)",
      subtitle: "The assessment will evaluate your ability to solve standard math problems accurately. Even though you are working with K-3 students, Title I requires paraeducators to demonstrate proficiency up to an 8th-grade math level.",
      topics: [
        {
          id: "m1-1",
          title: "1. Order of Operations (PEMDAS)",
          content: "When a math problem has multiple operations (addition, multiplication, etc.), you must solve them in a specific order. Remember the acronym <strong>PEMDAS</strong> (Please Excuse My Dear Aunt Sally):",
          steps: [
            "1. Parentheses",
            "2. Exponents",
            "3. Multiplication and Division (from left to right)",
            "4. Addition and Subtraction (from left to right)"
          ],
          example: {
            expr: "Example: 8 + 4 × 3 - 2",
            step1: "Step 1 (Multiply): 4 × 3 = 12",
            step2: "Step 2 (Rewrite): 8 + 12 - 2",
            step3: "Step 3 (Add/Subtract left to right): 20 - 2 = 18"
          }
        },
        {
          id: "m1-2",
          title: "2. Fractions",
          content: "Operations and simplification:",
          details: [
            "<strong>Adding and Subtracting</strong>: You must have a common denominator (the bottom number) before you can add or subtract the numerators (the top numbers).\n- Example: 1/3 + 2/5\n- Step 1 (Find common denominator): The lowest common multiple of 3 and 5 is 15.\n- Step 2 (Convert): 1/3 = 5/15 and 2/5 = 6/15\n- Step 3 (Add): 5/15 + 6/15 = 11/15",
            "<strong>Simplifying</strong>: Always reduce fractions to their lowest terms (e.g., 4/8 simplifies to 1/2)."
          ]
        },
        {
          id: "m1-3",
          title: "3. Percentages and Discounts",
          content: "You will often need to calculate percentages in real-world scenarios, such as finding a discount. To find a percentage of a number, convert the percentage to a decimal and multiply.",
          example: "Example: A kindergarten teacher is buying sensory bins that cost $300. There is a 20% discount. What is the final price?\n- Step 1: Convert 20% to 0.20.\n- Step 2: Multiply 300 × 0.20 = 60 (The discount is $60).\n- Step 3: Subtract the discount from the original price: $300 - $60 = $240."
        },
        {
          id: "m1-4",
          title: "4. Basic Algebra",
          content: "Algebra involves isolating a variable (usually x) on one side of the equal sign to find its value. You do this by performing the opposite operation on both sides of the equation.",
          example: "Example: 3x - 5 = 16\n- Step 1 (Add 5 to both sides): 3x = 21\n- Step 2 (Divide both sides by 3): x = 7"
        },
        {
          id: "m1-5",
          title: "5. Geometry (Area and Perimeter)",
          details: [
            "<strong>Area</strong>: The amount of space inside a flat, 2D shape. For a rectangle, the formula is Length × Width.\n- Example: A classroom rug is 12 ft long and 9 ft wide. Area = 12 × 9 = 108 square feet.",
            "<strong>Perimeter</strong>: The total distance around the outside of a shape. You find this by adding all the sides together.\n- Example: A rectangular K-3 play area is 40 ft long and 30 ft wide. Perimeter = 40 + 40 + 30 + 30 = 140 feet."
          ]
        },
        {
          id: "m1-6",
          title: "6. Data and Statistics & Ratios",
          details: [
            "<strong>Mean (Average)</strong>: Add all the numbers in a set together, then divide by the total count of numbers.\n- Example: A student's spelling scores are 80, 90, 85, and 95.\n- Step 1: 80 + 90 + 85 + 95 = 350\n- Step 2: 350 ÷ 4 = 87.5 (Mean score is 87.5).",
            "<strong>Ratios/Proportions</strong>: If a recipe needs 2 cups of flour for 3 batches, and you want to make 9 batches (which is 3 times as much), you need 3 times the flour (2 × 3 = 6 cups)."
          ]
        }
      ]
    },
    part2: {
      title: "Part 2: K-3 Math Instructional Scenarios (Pedagogical Skills)",
      subtitle: "In early elementary grades, math is highly conceptual and concrete. Students aren't just memorizing formulas; they are learning what numbers actually mean.",
      topics: [
        {
          id: "m2-1",
          title: "1. Visual Models and Manipulatives",
          tools: [
            { name: "Ten-Frames (K-1st Grade)", desc: "A two-by-five grid used to develop number sense. It helps students visually \"bridge to ten.\"\n- Scenario: A student is struggling with 8 + 5.\n- Paraeducator Role: Have the student place 8 counters in the first Ten-Frame. Then, ask them to add 5 more. They will see that 2 counters fill up the first frame (making 10), and 3 \"spill over\" into the next frame, making 13." },
            { name: "Base-Ten Blocks (1st-3rd Grade)", desc: "Used to teach place value (ones, tens, hundreds). A \"flat\" is 100, a \"rod\" is 10, and a \"unit\" is 1.\n- Scenario: A student doesn't understand that the \"2\" in 25 means twenty, not two. Base-ten blocks make this physically obvious (two rods and five units)." },
            { name: "Fraction Tiles/Circles (3rd Grade)", desc: "Physical pieces that represent parts of a whole.\n- Scenario: A student doesn't believe that 1/2 is equal to 2/4. Let them physically stack two 1/4 pieces on top of one 1/2 piece so they can see they take up the exact same amount of space." }
          ]
        },
        {
          id: "m2-2",
          title: "2. Error Analysis (Finding the \"Why\")",
          errors: [
            { name: "The Regrouping Error (Subtraction)", problem: "52 - 18 = ? | Student Answer: 44", diagnosis: "Analysis: The student didn't know how to \"borrow\" or regroup. Instead, they just looked at the ones column (2 and 8) and subtracted the smaller number from the larger number (8 - 2 = 6, or they just guessed 4), completely ignoring that the 8 is on the bottom." },
            { name: "The Place Value Error (Multiplication)", problem: "14 × 3 = ? | Student Answer: 312", diagnosis: "Analysis: The student multiplied 3 × 4 to get 12, and 3 × 1 to get 3, and just wrote the numbers side-by-side (3 and 12). They do not understand how to carry the ten into the next place value column." }
          ]
        },
        {
          id: "m2-3",
          title: "3. Word Problem Strategies",
          scaffolding: [
            "Word problems are notoriously difficult for young students because they combine reading comprehension with math computation.\n- Ineffective Approach: Saying, \"Just look at the numbers and add them together,\" or doing the math for them to save time.\n- Effective Scaffolding:\n  1. Read the problem aloud together.\n  2. Ask the student to visualize the story (e.g., \"Imagine Maria holding 5 apples...\").\n  3. Have the student circle the important numbers and underline the actual question being asked.\n  4. Ask guiding questions: \"Are we getting more apples, or taking apples away? What math symbol means 'getting more'?\""
          ]
        },
        {
          id: "m2-4",
          title: "4. Addressing Math Anxiety",
          strategy: "Many students develop math anxiety very early. When faced with a full worksheet, a student might cross their arms, shut down, or cry.\n- The \"Chunking\" Strategy: The brain gets overwhelmed by too much visual input. Take a blank piece of paper and cover up the entire worksheet except for the very first step of the very first problem. Say, \"We are only going to look at this one little piece right now.\""
        },
        {
          id: "m2-5",
          title: "5. Checking for Understanding",
          solution: "- The \"Nodding\" Trap: If you explain a concept and ask, \"Does that make sense?\", 90% of young students will nod \"yes\" even if they are completely lost, because they want to please you or avoid looking foolish.\n- The Pedagogical Solution: To truly check for understanding, say: \"Okay, now it's your turn. I want you to do the next problem, and I want you to talk out loud and teach me how you are doing it step-by-step.\""
        }
      ],
      scenarios: [
        {
          q: "1. A second-grade student is solving the problem 52 - 18 and gets the answer 44. What mistake is the student most likely making?",
          correct: "Correct Approach: The student is subtracting the smaller digit from the larger digit in the ones place (8 - 2 = 6, or guessing 4) instead of regrouping (borrowing from the tens place).",
          why: "Why: Understanding how a student arrived at a wrong answer allows you to target the specific skill they are missing (regrouping), rather than just reteaching basic subtraction facts."
        },
        {
          q: "2. A first-grade student looks at a word problem and immediately says, \"I don't know what to do.\" What is the most effective first step a paraeducator can suggest?",
          correct: "Correct Approach: \"Let's read it together. We will circle the numbers and underline what the question is asking us to find.\"",
          why: "Why: Breaking the word problem down into actionable reading steps removes the immediate anxiety of \"doing math\" and helps the student isolate necessary information."
        },
        {
          q: "3. You are helping a first-grade student understand how to add 8 + 5. What is the best way to model this visually?",
          correct: "Correct Approach: Use a Ten-Frame to show 8 counters, then add 5 more counters, showing how it fills the first frame to make 10 and leaves 3 remaining (10 + 3 = 13).",
          why: "Why: K-1 students need concrete visual models to bridge to ten, rather than just being told to memorize a math fact or count on their fingers."
        },
        {
          q: "4. After explaining a new math concept to a second-grade student, what is the most reliable way to ensure they actually understand it before moving on?",
          correct: "Correct Approach: Ask the student to talk you through their steps out loud as they solve the next problem on their own.",
          why: "Why: Asking \"Does that make sense?\" only elicits a yes/no response. Having the student teach it back to you forces them to demonstrate true comprehension."
        }
      ],
      keyTakeaway: "Key Takeaway for the Exam: In K-3 math scenarios, look for answers that involve <strong>using visual models (manipulatives), breaking tasks down into smaller steps, asking the student to explain their thinking, and analyzing the root cause of an error</strong>."
    }
  },

  flashcards: [
    { id: 1, category: "Reading", question: "What is Phonemic Awareness?", answer: "The auditory ability to hear, isolate, and manipulate individual sounds (phonemes) in spoken words. Segmenting \"cat\" -> /k/ - /a/ - /t/, completely without printed letters.", tag: "Kindergarten" },
    { id: 2, category: "Reading", question: "What is Choral Reading?", answer: "A fluency intervention where the paraeducator and student read the exact same text aloud together at the same time. Builds confidence.", tag: "Fluency" },
    { id: 3, category: "Reading", question: "What is Echo Reading?", answer: "A fluency intervention where the paraeducator reads a sentence with great expression, and the student echoes it back, mimicking pacing and tone.", tag: "Prosody" },
    { id: 4, category: "Reading", question: "What is Repeated Reading?", answer: "A fluency intervention where the student reads the same passage 3 to 5 times to improve accuracy, rate, and steadiness of pace.", tag: "Fluency" },
    { id: 5, category: "Reading", question: "What does PIE stand for in Author's Purpose?", answer: "P = Persuade (convince)\nI = Inform (give facts/directions)\nE = Entertain (storytelling)", tag: "Comprehension" },
    { id: 6, category: "Reading", question: "What is a Fix-Up Strategy?", answer: "When a student loses comprehension, have them stop, slowly reread the page, and verbally summarize after every paragraph using the 5 Ws.", tag: "Comprehension" },
    { id: 7, category: "Reading", question: "What are \"Heart Words\"?", answer: "A sight word strategy where students sound out regular parts of high-frequency words, but draw a heart above tricky irregular parts to memorize by heart (like \"ai\" in \"said\").", tag: "Phonics" },
    
    { id: 8, category: "Writing", question: "What is the difference between Revising and Editing?", answer: "REVISING is about Content & Organization (meat of story, beginning/middle/end, details).\nEDITING is about Mechanics (capital letters, punctuation, spelling).", tag: "Writing Process" },
    { id: 9, category: "Writing", question: "What is Inventive Spelling?", answer: "Encouraging early writers (K-1) to write the sounds they hear (e.g., \"kat\" for cat, \"fone\" for phone) during drafting to preserve fluency and train of thought.", tag: "Drafting" },
    { id: 10, category: "Writing", question: "What is a Dangling Modifier?", answer: "A descriptive phrase placed away from the noun described. E.g., \"Exhausted from the playground, the bell rang\" (the bell wasn't exhausted; the student was).", tag: "Grammar" },
    { id: 11, category: "Writing", question: "How to tell Affect vs. Effect apart?", answer: "AFFECT is usually a VERB (Action to influence: \"Rain will affect our plans\").\nEFFECT is usually a NOUN (Result: \"New policy had a positive effect\").\nHint: Affect = Action.", tag: "Grammar" },
    { id: 12, category: "Writing", question: "How do you fix a Comma Splice or Run-on?", answer: "1. Use a period.\n2. Use a semicolon (;).\n3. Use comma + FANBOYS conjunction (for, and, nor, but, or, yet, so).", tag: "Sentence Structure" },
    { id: 13, category: "Writing", question: "What is the Red Ink Warning in Editing?", answer: "Do NOT cover a student's paper in red ink (demoralizing). Instead, focus on 1 or 2 specific types of errors aligned with the current lesson.", tag: "Feedback" },
    
    { id: 14, category: "Math", question: "What is the order of operations in PEMDAS?", answer: "1. Parentheses ()\n2. Exponents (^)\n3. Multiplication & Division (left to right)\n4. Addition & Subtraction (left to right)\nExample: 8 + 4 × 3 - 2 = 18", tag: "Algebra" },
    { id: 15, category: "Math", question: "What is a Ten-Frame used for?", answer: "A 2x5 grid visual manipulative used in K-1st grade to help students visually \"bridge to ten\" during addition (e.g., 8 + 5 = 10 + 3 = 13).", tag: "Manipulatives" },
    { id: 16, category: "Math", question: "What mistake causes 52 - 18 = 44?", answer: "Regrouping Error (Subtraction): The student subtracted the smaller digit from the larger digit in the ones place (8 - 2 = 6, or guessed 4) instead of borrowing from tens.", tag: "Error Analysis" },
    { id: 17, category: "Math", question: "What mistake causes 14 × 3 = 312?", answer: "Place Value Error (Multiplication): The student multiplied 3×4=12 and 3×1=3 and wrote them side-by-side without carrying the ten.", tag: "Error Analysis" },
    { id: 18, category: "Math", question: "What is the \"Chunking\" strategy for Math Anxiety?", answer: "Covering up the full worksheet with a blank paper to focus on only the very first step of problem one.", tag: "Pedagogy" },
    { id: 19, category: "Math", question: "What is the \"Nodding Trap\" solution?", answer: "Instead of asking \"Does that make sense?\", say: \"Okay, now it's your turn. Talk out loud and teach me how you are doing it step-by-step.\"", tag: "Pedagogy" }
  ],

  assessment: {
    title: "Title I Paraprofessional Sample Assessment",
    instructions: "This sample assessment is designed to help you practice for the Title I Paraprofessional Exam. It includes 15 questions covering Reading, Writing, and Math. Each section tests both your foundational knowledge (Personal Proficiency) and your ability to assist K-3 students (Instructional Capability).\n\nChoose the best answer for each question. An answer key with explanations is provided at the end.",
    questions: [
      {
        id: 1,
        section: "Reading",
        type: "Personal Proficiency",
        question: "Read the following sentence: \"Sam sighed, closed his heavy textbook, rubbed his eyes, and looked at the clock displaying 2:00 AM.\" What can you infer from this sentence?",
        options: [
          "A) Sam is excited to go to school tomorrow.",
          "B) Sam is tired and has been studying for a long time.",
          "C) Sam is angry that his alarm clock went off early.",
          "D) Sam's textbook is too difficult for him to read."
        ],
        answer: 1, // B
        answerLetter: "B",
        explanation: "The text does not explicitly say Sam is tired, but we can infer it based on clues: sighing, rubbing eyes, heavy textbook, and the late hour (2:00 AM)."
      },
      {
        id: 2,
        section: "Reading",
        type: "Personal Proficiency",
        question: "\"The teacher's instructions for the art project were ambiguous, leading to confusion among the kindergarteners.\" In this sentence, ambiguous means:",
        options: [
          "A) Very clear and easy to follow.",
          "B) Loud and aggressive.",
          "C) Unclear or open to multiple interpretations.",
          "D) Scientifically accurate."
        ],
        answer: 2, // C
        answerLetter: "C",
        explanation: "Context clues. If the instructions led to \"confusion,\" we can deduce that the instructions were unclear or ambiguous."
      },
      {
        id: 3,
        section: "Reading",
        type: "Instructional Capability",
        question: "A kindergarten student is looking at a picture book and stops at the word \"bat.\" They look frustrated and say, \"I can't read this.\" What is the best response?",
        options: [
          "A) Read the word \"bat\" for them so they do not lose confidence.",
          "B) Ask, \"What sound does the first letter make? Let's stretch out the sounds.\"",
          "C) Tell them to look at the picture and just guess whatever animal is there.",
          "D) Tell them to skip the page and keep reading."
        ],
        answer: 1, // B
        answerLetter: "B",
        explanation: "Giving the child the answer (A) or letting them guess randomly (C) does not teach them how to read. Prompting them to use their phonics skills (sounding it out) builds independent reading skills."
      },
      {
        id: 4,
        section: "Reading",
        type: "Instructional Capability",
        question: "You are doing a reading intervention with a second-grade student who reads the words accurately but in a slow, robotic, monotone voice. What is the best strategy to use?",
        options: [
          "A) Have the student write down all the vocabulary words.",
          "B) Have the student read silently for 20 minutes.",
          "C) Tell the student to read faster.",
          "D) Use Echo Reading, where you read a sentence with proper expression, and the student repeats it back using the same tone."
        ],
        answer: 3, // D
        answerLetter: "D",
        explanation: "The student lacks prosody (expression). Echo reading allows the paraeducator to model what fluent, expressive reading sounds like so the student can mimic it."
      },
      {
        id: 5,
        section: "Reading",
        type: "Instructional Capability",
        question: "A third-grade student finishes reading a page about the water cycle and says, \"I have no idea what I just read.\" What should you do?",
        options: [
          "A) Tell the student to reread the page slowly and stop after every paragraph to verbally summarize what just happened.",
          "B) Tell the student to just keep reading, and it will make sense eventually.",
          "C) Tell the student to look up the word \"water\" in the glossary.",
          "D) Read the page aloud to the student while they close their eyes."
        ],
        answer: 0, // A
        answerLetter: "A",
        explanation: "Summarizing and chunking text are active comprehension strategies. If they don't understand it, just reading further won't help."
      },
      {
        id: 6,
        section: "Writing",
        type: "Personal Proficiency",
        question: "Choose the sentence with the correct subject-verb agreement:",
        options: [
          "A) The box of crayons belong on the teacher's desk.",
          "B) Every one of the students are getting a sticker today.",
          "C) The class has decided to play a game before lunch.",
          "D) Neither the teacher nor the students is ready for recess."
        ],
        answer: 2, // C
        answerLetter: "C",
        explanation: "\"Class\" is a collective noun acting as a single unit, so it takes the singular verb \"has.\" (A is incorrect because the subject is \"box\", which is singular and needs \"belongs\". B is incorrect because \"Every one\" is singular and needs \"is\")."
      },
      {
        id: 7,
        section: "Writing",
        type: "Personal Proficiency",
        question: "Identify the sentence that is a fragment (not a complete thought):",
        options: [
          "A) The children played outside.",
          "B) Waiting for the school bus in the pouring rain.",
          "C) The bell rang, so they packed their bags.",
          "D) He laughed."
        ],
        answer: 1, // B
        answerLetter: "B",
        explanation: "\"Waiting for the school bus in the pouring rain\" is missing a subject. We don't know who is waiting."
      },
      {
        id: 8,
        section: "Writing",
        type: "Instructional Capability",
        question: "A second-grade student is staring at a blank piece of paper for a writing prompt titled \"My Favorite Animal.\" The student says, \"I don't know what to write.\" What is the best instructional prompt?",
        options: [
          "A) \"Just write about a dog; that is an easy animal to write about.\"",
          "B) \"Let's brainstorm. Do you have any pets at home, or what animal do you like seeing at the zoo?\"",
          "C) \"You have to write something right now, or you will lose recess time.\"",
          "D) \"Look up the word 'animal' in the dictionary and copy the definition.\""
        ],
        answer: 1, // B
        answerLetter: "B",
        explanation: "The pre-writing stage should involve scaffolding through brainstorming and making personal connections. Telling them what to write (A) stunts their creative process."
      },
      {
        id: 9,
        section: "Writing",
        type: "Instructional Capability",
        question: "A first-grade student is writing a story but stops after every word to ask you how to spell it. How should the paraeducator respond to promote writing fluency?",
        options: [
          "A) Spell every single word for them so the rough draft is perfectly accurate.",
          "B) Make them look up every unknown word in a dictionary.",
          "C) Take the pencil and write the story for them as they dictate it.",
          "D) Tell them to write the sounds they hear (inventive spelling) and circle words they aren't sure about to fix later during editing."
        ],
        answer: 3, // D
        answerLetter: "D",
        explanation: "For early drafts, the goal is fluency (getting ideas on paper). Stopping to spell every word perfectly interrupts their train of thought. Using \"inventive spelling\" allows them to keep writing."
      },
      {
        id: 10,
        section: "Writing",
        type: "Instructional Capability",
        question: "You are helping a third-grade student with the Revising stage of their short story. Which of the following should you focus on?",
        options: [
          "A) Asking the student if their story has a clear beginning, middle, and end, and if the events make sense.",
          "B) Checking that all names and places are capitalized.",
          "C) Ensuring every sentence ends with a period or question mark.",
          "D) Correcting all the misspelled words with a red pen."
        ],
        answer: 0, // A
        answerLetter: "A",
        explanation: "Revising is about the content, organization, and flow of the story. Checking capitalization, punctuation, and spelling (options B, C, and D) is editing."
      },
      {
        id: 11,
        section: "Math",
        type: "Personal Proficiency",
        question: "Simplify the following expression: 8 + 4 × 3 - 2",
        options: [
          "A) 34",
          "B) 18",
          "C) 14",
          "D) 22"
        ],
        answer: 1, // B
        answerLetter: "B",
        explanation: "Follow PEMDAS. Multiplication first (4 × 3 = 12). Then rewrite: 8 + 12 - 2. Addition/Subtraction from left to right: 20 - 2 = 18."
      },
      {
        id: 12,
        section: "Math",
        type: "Personal Proficiency",
        question: "A teacher wants to put a new rug in her classroom. The rectangular space for the rug is 12 ft long and 9 ft wide. What is the area of the space?",
        options: [
          "A) 42 square feet",
          "B) 21 square feet",
          "C) 108 square feet",
          "D) 81 square feet"
        ],
        answer: 2, // C
        answerLetter: "C",
        explanation: "Area = Length × Width. 12 × 9 = 108 square feet."
      },
      {
        id: 13,
        section: "Math",
        type: "Instructional Capability",
        question: "A second-grade student is solving the problem 52 - 18 and gets the answer 46. What mistake is the student most likely making?",
        options: [
          "A) The student is adding the numbers instead of subtracting.",
          "B) The student is subtracting the smaller digit from the larger digit in the ones place (8 - 2 = 6, or guessing 4) instead of regrouping (borrowing from the tens place).",
          "C) The student forgot to write the negative sign.",
          "D) The student does not know their basic addition facts."
        ],
        answer: 1, // B
        answerLetter: "B",
        explanation: "This is a classic regrouping error. The student didn't know how to borrow from the 5, so they just subtracted the 2 from the 8. Understanding why they got it wrong helps you fix the actual gap in their knowledge."
      },
      {
        id: 14,
        section: "Math",
        type: "Instructional Capability",
        question: "You are helping a first-grade student understand how to add 8 + 5. What is the best way to model this visually?",
        options: [
          "A) Tell them to memorize it because it is a basic math fact.",
          "B) Explain that they should just write 13 and move on to the next problem.",
          "C) Use a Ten-Frame to show 8 counters, then add 5 more counters, showing how it fills the first frame to make 10 and leaves 3 remaining.",
          "D) Ask them, \"Does that make sense?\" and wait for them to nod."
        ],
        answer: 2, // C
        answerLetter: "C",
        explanation: "K-1 students need concrete visual models to understand how numbers work. The Ten-Frame helps them visually \"bridge to ten\" (8 + 2 = 10, with 3 leftover equals 13) rather than just rote memorization."
      },
      {
        id: 15,
        section: "Math",
        type: "Instructional Capability",
        question: "A student looks at a math worksheet filled with word problems, crosses their arms, and says, \"I can't do this, it's too much.\" What is the most appropriate pedagogical response?",
        options: [
          "A) \"That's okay, not everyone is a math person. Just do your best.\"",
          "B) \"Let's cover up the rest of the page with a blank paper and just read the very first sentence of problem number one together.\"",
          "C) \"If you don't finish this, you will have to stay in during recess.\"",
          "D) \"I'll do the first five for you so you have less to do.\""
        ],
        answer: 1, // B
        answerLetter: "B",
        explanation: "The student is experiencing math anxiety from being visually overwhelmed. \"Chunking\" (covering up the rest of the page) reduces visual input and makes the task manageable. Doing the work for them (D) doesn't teach them, and threatening them (C) increases anxiety."
      }
    ]
  }
};
