import { PersonaFieldType } from '@prisma/client';
import { PersonaSchemaSeed } from './persona-schema.types';

export const personaSchemaV1 = {
  schemaVersion: 1,
  description: "",
  personaComponents: [
    {
      slug: "brand_identity",
      label: "Brand Identity",
      title: "Establish who your brand is.",
      sortOrder: 1,
      personaSubComponents: [
        { 
          slug: "basics",
          label: "Basics",
          title: "Here's what BUZZZED found",
          sideTitle: "Here's what BUZZZED found",
          description: "We analyzed your website and pre-filled your project details. Review and edit anything before continuing.",
          sideInfo: "",
          sortOrder: 1,
          personaQuestions: [
            {
              name: "business_name",
              fieldType: PersonaFieldType.text,
              label: "Business Name",
              isRequired: true,
              fieldConfig: {
                max: 250,
              },
            },
            {
              name: "business_category",
              fieldType: PersonaFieldType.single_dropdown,
              label: "Business Category",
              isRequired: true,
              fieldConfig: {
                options: [
                  "Agency",
                  "Founder / Personal Brand",
                  "Celebrity",
                  "E-commerce Brand",
                  "Creator / Influencer",
                  "Corporate / Enterprise",
                  "Startup",
                  "Non-Profit",
                  "Consultant",
                  "Coach / Mentor",
                ],
              },
            },
            {
              name: "operating_model",
              fieldType: PersonaFieldType.single_broad_selector,
              label: "Select Operating Model",
              isRequired: true,
              fieldConfig: {
                options: [
                  {
                    title: "B2B",
                    brief: "Individual customers buying directly",
                  },
                  {
                    title: "B2C",
                    brief: "Sell products or services to businesses",
                  },
                  {
                    title: "B2B2C",
                    brief: "Sell through businesses to consumers",
                  },
                  {
                    title: "D2C",
                    brief: "No retailers or middlemen involved",
                  },
                  {
                    title: "Mixed",
                    brief: "Operate across more than one model",
                  },
                ],
              },
            },
            {
              name: "primary_language",
              fieldType: PersonaFieldType.single_dropdown,
              label: "Primary Language",
              isRequired: true,
              fieldConfig: {
                options: [
                  { value: "en-US", title: "English (US)" },
                  { value: "en-GB", title: "English (UK)" },
                  { value: "es", title: "Spanish" },
                  { value: "fr", title: "French" },
                  { value: "de", title: "German" },
                  { value: "ar", title: "Arabic" },
                  { value: "other", title: "Other" },
                ],
              },
            },
            {
              name: "primary_market",
              fieldType: PersonaFieldType.single_dropdown,
              label: "Primary Market",
              isRequired: true,
              fieldConfig: {
                options: [
                  "Global",
                  "United States",
                  "Europe",
                  "Middle East",
                  "South Asia",
                  "Southeast Asia",
                  "Africa",
                  "Latin America",
                ],
              },
            },
          ],
        },
        {
          slug: "what_you_do",
          label: "What You Do",
          title: "Here's what you do",
          sideTitle: "Here's what you do",
          description: "We drafted your core offer and messaging. Review and make edits if needed.",
          sideInfo: "",
          sortOrder: 2,
          personaQuestions: [
            {
              name: "one_line_description",
              fieldType: PersonaFieldType.textarea,
              label: "One-line description",
              isRequired: true,
              fieldConfig: {
                max: 500,
              },
            },
            {
              name: "what_do_you_sell",
              fieldType: PersonaFieldType.single_dropdown,
              label: "What do you sell?",
              isRequired: true,
              fieldConfig: {
                options: [
                  "Services",
                  "Physical products",
                  "Digital products",
                  "SaaS Platform / Subscription Software",
                  "Content / Media",
                  "Education / Courses",
                  "Mixed",
                ],
              },
            },
            {
              name: "what_makes_your_business_standout",
              fieldType: PersonaFieldType.multi_radio,
              label: "What makes your business stand out?",
              isRequired: true,
              fieldConfig: {
                max: 3,
                min: null,
                options: [
                  "Fast Setup",
                  "All-in-one Workflow",
                  "Results-Driven",
                  "AI-Powered",
                  "Built for Brands & Agencies",
                  "Scalable",
                  "Time-Saving",
                  "Founder-Led",
                  "Data-Driven",
                ],
              },
            },
          ],
        },
        {
          slug: "brand_positioning",
          label: "Brand Positioning",
          title: "Here's how your brand is positioned",
          sideTitle: "Here's how your brand is positioned",
          description: "We drafted your positioning. Review and edit anything below.",
          sideInfo: "",
          sortOrder: 3,
          personaQuestions: [
            {
              name: "elevator_pitch",
              fieldType: PersonaFieldType.textarea,
              label: "Elevator Pitch",
              isRequired: true,
              fieldConfig: {
                max: 500,
              },
            },
            {
              name: "primary_positioning",
              fieldType: PersonaFieldType.text,
              label: "Primary Positioning",
              isRequired: true,
              fieldConfig: {
                max: 250,
              },
            },
            {
              name: "secondary_positioning",
              fieldType: PersonaFieldType.text,
              label: "Secondary Positioning",
              isRequired: true,
              fieldConfig: {
                max: 250,
              },
            },
            {
              name: "tertiary_positioning",
              fieldType: PersonaFieldType.text,
              label: "Tertiary Positioning",
              isRequired: true,
              fieldConfig: {
                max: 250,
              },
            },
            {
              name: "mission_statement",
              fieldType: PersonaFieldType.textarea,
              label: "Mission Statement",
              isRequired: true,
              fieldConfig: {
                max: 500,
              },
            },
            {
              name: "vision_statement",
              fieldType: PersonaFieldType.textarea,
              label: "Vision Statement",
              isRequired: true,
              fieldConfig: {
                max: 500,
              },
            },
            {
              name: "brand_values",
              fieldType: PersonaFieldType.multi_radio,
              label: "Brand Values",
              isRequired: true,
              fieldConfig: {
                max: 5,
                min: null,
                options: [
                  "Fast Setup",
                  "All-in-one Workflow",
                  "Results-Driven",
                  "AI-Powered",
                  "Built for Brands & Agencies",
                  "Scalable",
                  "Time-Saving",
                  "Founder-Led",
                  "Data-Driven",
                ],
              },
            },
            {
              name: "brand_promise",
              fieldType: PersonaFieldType.text,
              label: "Brand Promise",
              isRequired: true,
              fieldConfig: {
                max: 250,
              },
            },
          ],
        },
        {
          slug: "brand_personality",
          label: "Brand Personality",
          title: "Brand Personality",
          sideTitle: "Brand Personality",
          description: "Define your brand archetype, tone, and personality dimensions.",
          sideInfo: "",
          sortOrder: 4,
          personaQuestions: [
            {
              name: "brand_archetype",
              fieldType: PersonaFieldType.multi_radio_with_brief,
              label: "Brand Archetype",
              isRequired: true,
              fieldConfig: {
                max: 1,
                min: null,
                options: [
                  {
                    title: "Hero",
                    brief: "Courageous, determined, driven to overcome challenges",
                  },
                  {
                    title: "Sage",
                    brief: "Wise, trusted, knowledge-driven authority",
                  },
                  {
                    title: "Outlaw",
                    brief: "Rebellious, disruptive, challenges the status quo",
                  },
                  {
                    title: "Creator",
                    brief: "Imaginative, artistic, builds things with meaning",
                  },
                  {
                    title: "Caregiver",
                    brief: "Nurturing, supportive, puts others first",
                  },
                  {
                    title: "Ruler",
                    brief: "Commanding, prestigious, establishes order",
                  },
                  {
                    title: "Magician",
                    brief: "Transformative, visionary, makes dreams happen",
                  },
                  {
                    title: "Innocent",
                    brief: "Optimistic, pure, simple and honest",
                  },
                  {
                    title: "Explorer",
                    brief: "Adventurous, pioneering, seeks new experiences",
                  },
                  {
                    title: "Lover",
                    brief: "Passionate, intimate, creates deep connections",
                  },
                  {
                    title: "Jester",
                    brief: "Playful, humorous, brings joy and lightness",
                  },
                  {
                    title: "Everyman",
                    brief: "Relatable, down-to-earth, inclusive and authentic",
                  },
                ],
              },
            },
            {
              name: "tone_attributes",
              fieldType: PersonaFieldType.multi_radio,
              label: "Tone Attributes",
              isRequired: true,
              fieldConfig: {
                max: 4,
                min: null,
                options: [
                  "Professional",
                  "Casual & Friendly",
                  "Bold & Edgy",
                  "Educational",
                  "Inspirational",
                  "Humorous",
                  "Authoritative",
                  "Empathetic",
                  "Witty",
                  "Premium",
                  "Warm",
                  "Confident",
                ],
              },
            },
            {
              name: "personality_sliders",
              fieldType: PersonaFieldType.multi_slider,
              label: "Personality Sliders",
              isRequired: true,
              fieldConfig: {
                max: null,
                min: 2,
                options: [
                  [
                    "Formal",
                    "Casual",
                  ],
                  [
                    "Serious",
                    "Playful",
                  ],
                  [
                    "Reserved",
                    "Bold",
                  ],
                  [
                    "Traditional",
                    "Modern",
                  ],
                  [
                    "Corporate",
                    "Friendly",
                  ],
                  [
                    "Premium",
                    "Accessible",
                  ],
                ],
              },
            },
          ],
        },
        {
          slug: "founder_voice",
          label: "Founder Voice",
          title: "Founder Voice",
          sideTitle: "Founder Voice",
          description: "Does a founder or CEO have a personal voice that should appear in content?",
          sideInfo: "",
          sortOrder: 5,
          personaQuestions: [
            {
              name: "include_founder_voice",
              fieldType: PersonaFieldType.switch,
              label: "Include founder voice in content?",
              isRequired: true,
              fieldConfig: {
                options: [
                  "Yes",
                  "No",
                ],
              },
            },
            {
              name: "founder_name",
              fieldType: PersonaFieldType.text,
              label: "Founder Name",
              isRequired: true,
              fieldConfig: {
                max: 250,
              },
            },
            {
              name: "founder_role",
              fieldType: PersonaFieldType.single_dropdown,
              label: "Founder Role",
              isRequired: true,
              fieldConfig: {
                options: [
                  "Founder",
                  "CEO",
                  "CTO",
                  "CMO",
                  "Creative Director",
                  "Author",
                  "Expert",
                  "Coach",
                  "Other",
                ],
              },
            },
            {
              name: "appears_in_content",
              fieldType: PersonaFieldType.single_dropdown,
              label: "Appears in content",
              isRequired: false,
              fieldConfig: {
                options: [
                  "Always",
                  "Often",
                  "Sometimes",
                  "Rarely",
                  "Never",
                ],
              },
            },
            {
              name: "founder_tone_style",
              fieldType: PersonaFieldType.single_dropdown,
              label: "Founder Tone Style",
              isRequired: false,
              fieldConfig: {
                options: [
                  "Same as brand voice",
                  "More personal / raw",
                  "More polished / executive",
                  "Storytelling-led",
                  "Educational-led",
                ],
              },
            },
            {
              name: "founder_bio",
              fieldType: PersonaFieldType.textarea,
              label: "Founder Bio",
              isRequired: false,
              fieldConfig: {
                max: 500,
              },
            },
            {
              name: "founder_photo_library",
              fieldType: PersonaFieldType.file_upload_multiple,
              label: "Founder Photo Library",
              isRequired: false,
              fieldConfig: {
                max: 5,
                sizeLimit: 10485760,
                allowedFileTypes: [
                  "image/jpeg",
                  "image/png",
                  "image/webp",
                ],
              },
            },
          ],
        },
      ],
    },
    {
      slug: "audience_goals",
      label: "Audience & Goals",
      title: "Define who you're speaking to.",
      sortOrder: 2,
      personaSubComponents: [
        {
          slug: "audience_persona",
          label: "Audience Persona",
          title: "Audience Persona",
          sideTitle: "Audience Persona",
          description: "Build a precise profile of who you're creating content for.",
          sideInfo: "",
          sortOrder: 1,
          personaQuestions: [
            {
              name: "persona_name",
              fieldType: PersonaFieldType.text,
              label: "Persona Name",
              isRequired: true,
              fieldConfig: {
                max: 250,
              },
            },
            {
              name: "age_range",
              fieldType: PersonaFieldType.range_slider,
              label: "Age Range",
              isRequired: false,
              fieldConfig: {
                min: 18,
                max: 65,
              },
            },
            {
              name: "gender",
              fieldType: PersonaFieldType.multi_radio,
              label: "Gender",
              isRequired: true,
              fieldConfig: {
                max: null,
                min: null,
                options: [
                  "All",
                  "Male",
                  "Female",
                  "Non-Binary",
                  "Custom",
                ],
              },
            },
            {
              name: "seniority_level",
              fieldType: PersonaFieldType.single_dropdown,
              label: "Seniority (B2B)",
              isRequired: false,
              fieldConfig: {
                options: [
                  "C-level",
                  "VP / Director",
                  "Manager",
                  "IC",
                  "Owner / Founder"
                ],
              },
            },
            {
              name: "company_size",
              fieldType: PersonaFieldType.single_dropdown,
              label: "Company Size (B2B)",
              isRequired: false,
              fieldConfig: {
                options: [
                  "Solopreneur",
                  "2-10",
                  "11-50",
                  "51-200",
                  "201-1K+"
                ],
              },
            },
            {
              name: "top_pain_points",
              fieldType: PersonaFieldType.single_broad_selector,
              label: "Top Pain Points",
              isRequired: false,
              fieldConfig: {
                max: 3,
                min: null,
                options: [
                  {
                    title: "Inconsistent content",
                    brief: "Content varies in quality, tone, or format across channels",
                  },
                  {
                    title: "Low engagement",
                    brief: "Posts and content fail to attract likes, shares, or comments",
                  },
                  {
                    title: "No time to create",
                    brief: "Not enough hours to produce content consistently",
                  },
                  {
                    title: "No clear strategy",
                    brief: "Content lacks direction, goals, or a cohesive plan",
                  },
                  {
                    title: "Hard to scale",
                    brief: "Can't produce more content without proportionally more effort",
                  },
                  {
                    title: "Poor ROI",
                    brief: "Content investment doesn't translate into measurable returns",
                  },
                  {
                    title: "Too many tools",
                    brief: "Managing multiple platforms and tools is overwhelming",
                  },
                  {
                    title: "Brand inconsistency",
                    brief: "Messaging and visuals don't align across touchpoints",
                  },
                ],
              },
            },
            {
              name: "top_goals_aspirations",
              fieldType: PersonaFieldType.multi_radio,
              label: "Top Goals / Aspirations",
              isRequired: false,
              fieldConfig: {
                max: 3,
                min: null,
                options: [
                  "Build authority",
                  "Grow followers",
                  "Improve ROI",
                  "Save time",
                  "Generate leads",
                  "Scale content",
                  "Build community",
                  "Launch a brand",
                  "Increase sales",
                ],
              },
            },
            {
              name: "where_they_hang_out_online",
              fieldType: PersonaFieldType.multi_radio,
              label: "Where they hang out online",
              isRequired: false,
              fieldConfig: {
                max: null,
                min: null,
                options: [
                  "Facebook",
                  "Instagram",
                  "YouTube",
                  "TikTok",
                  "X",
                  "Snapchat",
                  "LinkedIn",
                  "Pinterest",
                  "Discord",
                ],
              },
            },
            {
              name: "their_role_in_buying",
              fieldType: PersonaFieldType.single_dropdown,
              label: "Their role in buying",
              isRequired: false,
              fieldConfig: {
                options: [
                  "Decision maker",
                  "Influencer",
                  "End-user"
                ],
              },
            },
            {
              name: "what_they_consume",
              fieldType: PersonaFieldType.multi_radio,
              label: "What they consume",
              isRequired: false,
              fieldConfig: {
                max: null,
                min: null,
                options: [
                  "Top creators",
                  "Industry publications",
                  "YouTube channels",
                  "Podcasts",
                  "Newsletters",
                  "Trade journals",
                ],
              },
            },
          ],     
        },
        {
          slug: "representation",
          label: "Representation",
          title: "Who Appears in Content?",
          sideTitle: "Who Appears in Content?",
          description: "These choices shape every visual BUZZZED generates for you.",
          sideInfo: "",
          sortOrder: 2,
          personaQuestions: [
            {
              name: "people_shown_in_content",
              fieldType: PersonaFieldType.multi_radio,
              label: "People shown in content",
              isRequired: false,
              fieldConfig: {
                max: null,
                min: null,
                options: [
                  "Same demographics as audience",
                  "Founder only",
                  "Real customers",
                  "Diverse / multicultural",
                  "Team members",
                  "No people",
                ],
              },
            },
          ],
        },
        {
          slug: "goals",
          label: "Goals",
          title: "Goals",
          sideTitle: "Goals",
          description: "Set your primary business objective and time horizon.",
          sideInfo: "",
          sortOrder: 3,
          personaQuestions: [
            {
              name: "primary_business_objective",
              fieldType: PersonaFieldType.multi_radio,
              label: "Primary Business Objective",
              isRequired: true,
              fieldConfig: {
                max: null,
                min: null,
                options: [
                  "Build awareness",
                  "Generate leads",
                  "Establish thought leadership",
                  "Build community",
                  "Recruit talent",
                  "Retain customers",
                  "Drive sales",
                  "Drive traffic",
                ],
              },
            },
            {
              name: "time_horizon",
              fieldType: PersonaFieldType.single_dropdown,
              label: "Time Horizon",
              isRequired: false,
              fieldConfig: {
                options: [
                  "1 month",
                  "3 months",
                  "6 months",
                  "12 months",
                  "Ongoing",
                ],
              },
            },
            {
              name: "monthly_content_budget",
              fieldType: PersonaFieldType.single_slider,
              label: "Monthly Content Budget",
              isRequired: false,
              fieldConfig: {
                min: 100,
                max: 10000,
                minLabel: "$100",
                maxLabel: "$10K",
              },
            },
          ],
        },
        {
          slug: "competitive_context",
          label: "Competitive Context",
          title: "Competitive Context",
          sideTitle: "Competitive Context",
          description: "Optional — AI analyzes competitor public content to sharpen your differentiation.",
          sideInfo: "",
          sortOrder: 4,
          personaQuestions: [
            {
              name: "top_competitors",
              fieldType: PersonaFieldType.multi_text,
              label: "Top Competitors",
              isRequired: false,
              fieldConfig: {
                max: 3,
                min: null,
                placeholders: [
                  "https://competitor1.com",
                  "https://competitor2.com",
                  "https://competitor3.com",
                ],
              },
            },
            {
              name: "differentiation_in_one_line",
              fieldType: PersonaFieldType.text,
              label: "Differentiation in one line",
              isRequired: false,
              fieldConfig: {
                max: 250,
                placeholder: "We're the only platform that...",
                helperText: "What makes you different from all of them?",
              },
            },
          ],
        },
        {
          slug: "funnel_mix",
          label: "Funnel Mix",
          title: "Funnel Stage Content Mix",
          sideTitle: "Funnel Stage Content Mix",
          description: "How much of your content should target each stage of the funnel? Sliders are linked — they always sum to 100%.",
          sideInfo: "",
          sortOrder: 5,
          personaQuestions: [
            {
              name: "funnel_mix",
              fieldType: PersonaFieldType.multi_slider,
              label: "Funnel Mix",
              isRequired: true,
              fieldConfig: {
                min: 0,
                max: 100,
                sumTo: 100,
                options: [
                  "TOFU (Awareness)",
                  "MOFU (Consideration)",
                  "BOFU (Decision)",
                ],
                helperText:
                  "A 50/30/20 split is the most common high-performing mix. Adjust based on your current stage.",
              },
            },
          ],
        }
      ],
    },
    {
      slug: "content_strategy",
      label: "Content Strategy",
      title: "Set what you'll talk about.",
      sortOrder: 3,
      personaSubComponents: [
        {
          slug: "content_pillars",
          label: "Content Pillars",
          title: "Content Pillars",
          sideTitle: "Content Pillars",
          description: "Pick 3-5 pillars, then set the weighting. AI generates content across all of them proportionally.",
          sideInfo: "",
          sortOrder: 1,
          personaQuestions: [
            {
              name: "content_pillars",
              fieldType: PersonaFieldType.multi_radio,
              label: "Select your pillars (3-5)",
              isRequired: true,
              fieldConfig: {
                min: 1,
                max: 5,
                options: [
                  "Education",
                  "Thought Leadership",
                  "Quick Tips",
                  "Entertainment",
                  "Inspiration",
                  "Behind-the-Scenes",
                  "Customer Stories",
                  "Personal Story",
                  "Product / Promotion",
                  "Listicles",
                  "Q&A / FAQ",
                  "Trends / Reactive",
                  "Case Studies",
                  "Polls / Interactive",
                  "How-to",
                  "Industry Commentary",
                  "Memes / Humor",
                ],
              },
            },
            {
              name: "pillar_weighting",
              fieldType: PersonaFieldType.multi_slider,
              label: "Pillar Weighting",
              isRequired: true,
              fieldConfig: {
                dependsOn: "content_pillars",
                min: 0,
                max: 100,
                sumTo: 100,
                minCount: 1,
                maxCount: 5,
                helperText: "Drag sliders to balance your content mix.",
              },
            },
            {
              name: "promotional_vs_value_ratio",
              fieldType: PersonaFieldType.single_slider,
              label: "Promotional vs. Value ratio",
              isRequired: false,
              fieldConfig: {
                min: 5,
                max: 50
              },
            },
          ],
        },
        {
          slug: "content_mode",
          label: "Content Mode",
          title: "Primary Content Mode",
          sideTitle: "Primary Content Mode",
          description: "This sets the strategic voice across all your posts.",
          sideInfo: "",
          sortOrder: 1,
          personaQuestions: [
            {
              name: "primary_content_mode",
              fieldType: PersonaFieldType.single_banner_selector,
              label: "Primary Content Mode",
              isRequired: true,
              fieldConfig: {
                options: [
                  {
                    title: "Thought Leadership",
                    brief:
                      "Share expert insights and industry perspectives that position your brand as the go-to authority in your space.",
                    recommendReason: "Establishes trust with decision-makers before they are ready to buy.",
                    isRecommended: false,
                    icon: "🧠",
                    slug: "thought-leadership",
                  },
                  {
                    title: "Promotional",
                    brief:
                      "Lead with offers, launches, and clear calls-to-action that turn attention into revenue.",
                    recommendReason: "Builds credibility and attracts high-intent prospects.",
                    isRecommended: true,
                    icon: "🛍️",
                    slug: "promotional",
                  },
                  {
                    title: "Storytelling",
                    brief:
                      "Use narrative arcs and personal moments to make your brand memorable and emotionally resonant.",
                    recommendReason: "Deepens audience connection and improves recall across channels.",
                    isRecommended: false,
                    icon: "🎤",
                    slug: "storytelling",
                  },
                  {
                    title: "Educational Series",
                    brief:
                      "Break complex topics into structured lessons that teach your audience something useful over time.",
                    recommendReason: "Drives saves and shares while nurturing long-term followers.",
                    isRecommended: false,
                    icon: "📚",
                    slug: "educational-series",
                  },
                  {
                    title: "Behind-the-Scenes",
                    brief:
                      "Pull back the curtain on how you work, who you are, and what happens before the polished post.",
                    recommendReason: "Humanizes your brand and increases authentic engagement.",
                    isRecommended: false,
                    icon: "🎥",
                    slug: "behind-the-scenes",
                  },
                  {
                    title: "Product Showcase",
                    brief:
                      "Highlight features, benefits, and real-world use cases so people understand what you offer and why it matters.",
                    recommendReason: "Shortens the path from discovery to consideration for buyers.",
                    isRecommended: false,
                    icon: "📦",
                    slug: "product-showcase",
                  },
                  {
                    title: "Community Building",
                    brief:
                      "Spark conversations, celebrate customers, and create content that invites people to participate—not just watch.",
                    recommendReason: "Grows loyalty and turns followers into advocates.",
                    isRecommended: false,
                    icon: "🤝",
                    slug: "community-building",
                  },
                  {
                    title: "Mixed / Auto",
                    brief:
                      "Let BUZZZED balance formats based on your goals, mixing value, promotion, and personality automatically.",
                    recommendReason: "Keeps your feed fresh without locking into one content style.",
                    isRecommended: false,
                    icon: "🎨",
                    slug: "mixed-auto",
                  }                
                ],
              },
            },
          ],
        },
        {
          slug: "compliance",
          label: "Compliance",
          title: "Compliance & Guardrails",
          sideTitle: "Compliance & Guardrails",
          description: "Set once — they apply to every piece of content BUZZZED creates.",
          sideInfo: "",
          sortOrder: 1,
          personaQuestions: [
            {
              name: "industry_compliance",
              fieldType: PersonaFieldType.single_dropdown,
              label: "Industry Compliance",
              isRequired: false,
              fieldConfig: {
                options: [
                  "None",
                  "Finance / SEC",
                  "Healthcare / HIPAA",
                  "Legal",
                  "Alcohol / Cannabis",
                  "Supplements",
                  "Children's products",
                  "Crypto",
                  "Other",
                ],
              },
            },
            {
              name: "topics_to_avoid",
              fieldType: PersonaFieldType.multi_radio,
              label: "Topics to Avoid",
              isRequired: false,
              fieldConfig: {
                max: null,
                min: null,
                options: [
                  "Politics",
                  "Religion",
                  "Competitor names",
                  "Controversial social issues",
                  "Negative news",
                ],
              },
            },
            {
              name: "profanity_edge",
              fieldType: PersonaFieldType.single_dropdown,
              label: "Profanity / Edge",
              isRequired: false,
              fieldConfig: {
                options: [
                  "Never",
                  "Mild only",
                  "Open if on-brand",
                ],
              },
            },
            {
              name: "brand_safety_level",
              fieldType: PersonaFieldType.single_dropdown,
              label: "Brand Safety Level",
              isRequired: false,
              fieldConfig: {
                options: [
                  "Conservative",
                  "Balanced",
                  "Open / Bold",
                ],
              },
            },
          ],
        },
        {
          slug: "key_dates",
          label: "Key Dates",
          title: "Key Dates",
          sideTitle: "Key Dates",
          description: "Optional — key dates unlock launch-campaign templates automatically.",
          sideInfo: "",
          sortOrder: 1,
          personaQuestions: [
            {
              name: "upcoming_launches_or_events",
              fieldType: PersonaFieldType.multi_date_entry,
              label: "Upcoming Launches or Events",
              isRequired: false,
              fieldConfig: {
                max: 5,
                min: null,
                nameMax: 250,
                genericLabel: "Event",
                textPlaceholder: "Add short description about the event.",

              },
            },
            {
              name: "promotional_campaigns",
              fieldType: PersonaFieldType.multi_date_entry,
              label: "Promotional Campaigns",
              isRequired: false,
              fieldConfig: {
                max: 5,
                min: null,
                nameMax: 250,
                genericLabel: "Campaign",
                textPlaceholder: "Add short description about the campaign.",
              },
            },
          ],
        }
      ],
    },
    {
      slug: "channels_cadence",
      label: "Channels & Cadence",
      title: "Choose where and when to post.",
      sortOrder: 4,
      personaSubComponents: [
        {
          slug: "basics",
          label: "Basics",
          title: "Here's what BUZZZED found",
          sideTitle: "Here's what BUZZZED found",
          description: "We analyzed your website and pre-filled your project details. Review and edit anything before continuing.",
          sideInfo: "",
          sortOrder: 1,
          personaQuestions: [],
        },
      ],
    },
    {
      slug: "design_voice",
      label: "Design & Voice",
      title: "Shape your look and tone.",
      sortOrder: 5,
      personaSubComponents: [
        {
          slug: "basics",
          label: "Basics",
          title: "Here's what BUZZZED found",
          sideTitle: "Here's what BUZZZED found",
          description: "We analyzed your website and pre-filled your project details. Review and edit anything before continuing.",
          sideInfo: "",
          sortOrder: 1,
          personaQuestions: [],
        },
      ],
    },
  ],
} satisfies PersonaSchemaSeed;
