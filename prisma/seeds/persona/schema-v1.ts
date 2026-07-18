import { PersonaFieldType } from '@prisma/client';
import { personaAssetUrl } from './asset-url';
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
          sideInfo: {
            "title": "Does this look right?",
            "description": "We pre-filled your brand details based on your website. <br /> <br /> You can edit anything before continuing."
          },
          sidePanelShortInfo: "Pre-filled from your website — just verify and continue.",
          sortOrder: 1,
          personaQuestions: [
            {
              name: "business_name",
              fieldType: PersonaFieldType.text,
              label: "Business Name",
              isRequired: true,
              fieldConfig: {
                max: 250,
                placeholder: "BUZZZED",
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
          sideInfo: {
            "title": "What to look for?",
            "description": "Review the details BUZZZED pulled from your website and make changes if anything feels off.",
            "items": [
              {
                "title": "Check your description",
                "description": "Make sure your one-line summary clearly explains what your business does and who it helps."
              },
              {
                "title": "Check what you sell",
                "description": "Confirm your primary offering product, service, SaaS, education, or mixed."
              },
              {
                "title": "Check your key strengths",
                "description": "Choose up to 3 qualities you want BUZZZED to emphasize in your messaging and content."
              }
            ]
          },
          sidePanelShortInfo: "A sharp one-liner is the foundation of all your content.",
          sortOrder: 2,
          personaQuestions: [
            {
              name: "one_line_description",
              fieldType: PersonaFieldType.textarea,
              label: "One-line description",
              isRequired: true,
              fieldConfig: {
                max: 500,
                placeholder: "We help brands create, design, and publish content faster with AI.",
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
          sideInfo: {
            title: "What to look for?",
            description: "",
            items: [
              {
                title: "Elevator pitch",
                description: "Who, problem, outcome.",
              },
              {
                title: "Mission & Vision",
                description: "Why you exist and where you're going.",
              },
              {
                title: "Brand Promise",
                description: "What customers can always count on from you.",
              },
            ],
          },
          sidePanelShortInfo: "Strong positioning creates content that attracts the right audience.",
          sortOrder: 3,
          personaQuestions: [
            {
              name: "elevator_pitch",
              fieldType: PersonaFieldType.textarea,
              label: "Elevator Pitch",
              isRequired: true,
              fieldConfig: {
                max: 500,
                placeholder: "Marketing teams, brands, agencies, and content creators looking to create content faster with AI.",
              },
            },
            {
              name: "primary_positioning",
              fieldType: PersonaFieldType.text,
              label: "Primary Positioning",
              isRequired: true,
              fieldConfig: {
                max: 250,
                placeholder: "We help brands create better content...",
              },
            },
            {
              name: "secondary_positioning",
              fieldType: PersonaFieldType.text,
              label: "Secondary Positioning",
              isRequired: true,
              fieldConfig: {
                max: 250,
                placeholder: "We help brands create better content...",
              },
            },
            {
              name: "tertiary_positioning",
              fieldType: PersonaFieldType.text,
              label: "Tertiary Positioning",
              isRequired: true,
              fieldConfig: {
                max: 250,
                placeholder: "Helping brands simplify content creation from strategy to publishing.",
              },
            },
            {
              name: "mission_statement",
              fieldType: PersonaFieldType.textarea,
              label: "Mission Statement",
              isRequired: true,
              fieldConfig: {
                max: 500,
                placeholder: "Marketing teams, brands, agencies, and content creators looking to create content faster with AI.",
              },
            },
            {
              name: "vision_statement",
              fieldType: PersonaFieldType.textarea,
              label: "Vision Statement",
              isRequired: true,
              fieldConfig: {
                max: 500,
                placeholder: "Marketing teams, brands, agencies, and content creators looking to create content faster with AI.",
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
                placeholder: "Helping brands simplify content creation from strategy to publishing.",
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
          sideInfo: {
            title: "Why this matters?",
            description: "",
            items: [
              {
                title: "Brand archetype",
                description: "Gives AI a personality framework to write from.",
              },
              {
                title: "Personality sliders",
                description:
                  "Set at least 2 — they control content variation ratio.",
              },
              {
                title: "Tone tags",
                description: "Select up to 4 that feel most authentic.",
              },
            ],
          },
          sidePanelShortInfo: "Your archetype guides every content decision the AI makes.",
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
          sideInfo: {
            title: "What to look for?",
            description: "",
            items: [
              {
                title: "Personal vs Brand Voice",
                description:
                  "Decide whether content should sound like the founder or the company.",
              },
              {
                title: "Authenticity",
                description:
                  "Use founder voice if your audience connects with personal insights and experiences.",
              },
              {
                title: "Trust & Authority",
                description:
                  "Founder-led content can build credibility and stronger audience relationships.",
              },
              {
                title: "Consistency",
                description:
                  "Enable this only if the founder's perspective should appear regularly across content.",
              },
            ],
          },
          sidePanelShortInfo: "Founder-led content drives 3× higher trust signals.",
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
              isRequired: false,
              fieldConfig: {
                enabledWhen: {
                  question: "include_founder_voice",
                  value: "Yes",
                },
                requiredWhen: {
                  question: "include_founder_voice",
                  value: "Yes",
                },
                max: 250,
                placeholder: "Full Name",
              },
            },
            {
              name: "founder_role",
              fieldType: PersonaFieldType.single_dropdown,
              label: "Founder Role",
              isRequired: false,
              fieldConfig: {
                enabledWhen: {
                  question: "include_founder_voice",
                  value: "Yes",
                },
                requiredWhen: {
                  question: "include_founder_voice",
                  value: "Yes",
                },
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
                enabledWhen: {
                  question: "include_founder_voice",
                  value: "Yes",
                },
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
                enabledWhen: {
                  question: "include_founder_voice",
                  value: "Yes",
                },
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
                enabledWhen: {
                  question: "include_founder_voice",
                  value: "Yes",
                },
                max: 500,
                placeholder: "One paragraph about the founder's background, expertise, and story.",
              },
            },
            {
              name: "founder_photo_library",
              fieldType: PersonaFieldType.file_upload_multiple,
              label: "Founder Photo Library",
              isRequired: false,
              fieldConfig: {
                enabledWhen: {
                  question: "include_founder_voice",
                  value: "Yes",
                },
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
          sideInfo: {
            title: "Build your audience",
            description: "",
            items: [
              {
                title: "Be specific",
                description: "Niche audiences outperform broad ones every time.",
              },
              {
                title: "Pain points matter",
                description: "What keeps them up at night?",
              },
              {
                title: "B2B fields",
                description:
                  "Role, seniority, and company size shape tone significantly.",
              },
            ],
          },
          sidePanelShortInfo: "Be specific — the more precise, the better AI performs.",
          sortOrder: 1,
          personaQuestions: [
            {
              name: "persona_name",
              fieldType: PersonaFieldType.text,
              label: "Persona Name",
              isRequired: true,
              fieldConfig: {
                max: 250,
                placeholder: "Persona name e.g. 'Marketing Mia'",
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
          sideInfo: {
            title: "Representation Guidelines",
            description: "",
            items: [
              {
                title: "Audience Match",
                description: "Choose people who reflect your target audience.",
              },
              {
                title: "Authenticity",
                description:
                  "Use real founders, customers, or team members when relevant.",
              },
              {
                title: "Consistency",
                description:
                  "Your selections will guide all AI-generated visuals.",
              },
            ],
          },
          sidePanelShortInfo: "Representation choices shape every visual AI generates.",
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
          sideInfo: {
            title: "Goal Planning",
            description: "",
            items: [
              {
                title: "Primary Objective",
                description: "Choose the main outcome you want content to achieve.",
              },
              {
                title: "Time Horizon",
                description: "Set whether your goal is short-term or ongoing.",
              },
              {
                title: "Content Budget",
                description: "Helps BUZZZED tailor content volume and recommendations.",
              },
            ],
          },
          sidePanelShortInfo: "Clear goals help AI optimize every post for the right outcome.",
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
          sideInfo: {
            title: "Competitive Positioning",
            description: "",
            items: [
              {
                title: "Relevant Competitors",
                description:
                  "Add competitors your audience actively compares you against.",
              },
              {
                title: "Your Difference",
                description:
                  "Focus on the one thing you do better, faster, or differently.",
              },
              {
                title: "Clear Positioning",
                description:
                  "A strong differentiation statement helps BUZZZED create more distinct content.",
              },
            ],
          },
          sidePanelShortInfo: "Optional — but competitor analysis sharpens differentiation significantly.",
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
          sideInfo: {
            title: "Funnel Mix Guidance",
            description: "",
            items: [
              {
                title: "Awareness vs Conversion",
                description:
                  "Adjust the balance based on whether you need more reach, consideration, or sales.",
              },
              {
                title: "Match Business Goals",
                description:
                  "Growing a brand? Increase TOFU. Driving revenue? Increase BOFU.",
              },
              {
                title: "Keep It Balanced",
                description:
                  "A healthy mix ensures you're attracting, nurturing, and converting your audience.",
              },
            ],
          },
          sidePanelShortInfo: "A 50/30/20 TOFU/MOFU/BOFU split is the most common high-performer.",
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
          sideInfo: {
            title: "Content Strategy Tips",
            description: "",
            items: [
              {
                title: "Choose Core Pillars",
                description:
                  "Select 3–5 topics you want your brand to be known for.",
              },
              {
                title: "Set Priorities",
                description:
                  "Higher-weighted pillars will appear more often in generated content.",
              },
              {
                title: "Balance Value & Promotion",
                description:
                  "Focus on helping your audience first, then weave in promotional content naturally.",
              },
            ],
          },
          sidePanelShortInfo: "Pick 3–5 pillars. AI generates content across all of them weighted by your mix.",
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
          sideInfo: {
            title: "Content Mode Guide",
            description: "",
            items: [
              {
                title: "Match Your Goal",
                description:
                  "Choose the content mode that best supports your primary business objective.",
              },
              {
                title: "Shape Your Voice",
                description:
                  "This setting influences how BUZZZED frames ideas, stories, and messaging.",
              },
              {
                title: "Stay Consistent",
                description:
                  "Your selected mode becomes the default approach across generated content.",
              },
            ],
          },
          sidePanelShortInfo: "Content mode sets the strategic voice across all your posts.",
          sortOrder: 2,
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
                    bannerAsset: personaAssetUrl(
                      "content-mode/banners/thought-leadership-banner.webp",
                      "content-mode/banners/thought-leadership-banner.webp",
                    ),
                    thumbnailAsset: personaAssetUrl(
                      "content-mode/thumbs/thought-leadership-thumb.webp",
                      "content-mode/thumbs/thought-leadership-thumb.webp",
                    ),
                  },
                  {
                    title: "Promotional",
                    brief:
                      "Lead with offers, launches, and clear calls-to-action that turn attention into revenue.",
                    recommendReason: "Builds credibility and attracts high-intent prospects.",
                    isRecommended: true,
                    icon: "🛍️",
                    slug: "promotional",
                    bannerAsset: personaAssetUrl(
                      "content-mode/banners/promotional-banner.webp",
                      "content-mode/banners/promotional-banner.webp",
                    ),
                    thumbnailAsset: personaAssetUrl(
                      "content-mode/thumbs/promotional-thumb.webp",
                      "content-mode/thumbs/promotional-thumb.webp",
                    ),
                  },
                  {
                    title: "Storytelling",
                    brief:
                      "Use narrative arcs and personal moments to make your brand memorable and emotionally resonant.",
                    recommendReason: "Deepens audience connection and improves recall across channels.",
                    isRecommended: false,
                    icon: "🎤",
                    slug: "storytelling",
                    bannerAsset: personaAssetUrl(
                      "content-mode/banners/storytelling-banner.webp",
                      "content-mode/banners/storytelling-banner.webp",
                    ),
                    thumbnailAsset: personaAssetUrl(
                      "content-mode/thumbs/storytelling-thumb.webp",
                      "content-mode/thumbs/storytelling-thumb.webp",
                    ),
                  },
                  {
                    title: "Educational Series",
                    brief:
                      "Break complex topics into structured lessons that teach your audience something useful over time.",
                    recommendReason: "Drives saves and shares while nurturing long-term followers.",
                    isRecommended: false,
                    icon: "📚",
                    slug: "educational-series",
                    bannerAsset: personaAssetUrl(
                      "content-mode/banners/educational-series-banner.webp",
                      "content-mode/banners/educational-series-banner.webp",
                    ),
                    thumbnailAsset: personaAssetUrl(
                      "content-mode/thumbs/educational-series-thumb.webp",
                      "content-mode/thumbs/educational-series-thumb.webp",
                    ),
                  },
                  {
                    title: "Behind-the-Scenes",
                    brief:
                      "Pull back the curtain on how you work, who you are, and what happens before the polished post.",
                    recommendReason: "Humanizes your brand and increases authentic engagement.",
                    isRecommended: false,
                    icon: "🎥",
                    slug: "behind-the-scenes",
                    bannerAsset: personaAssetUrl(
                      "content-mode/banners/behind-the-scenes-banner.webp",
                      "content-mode/banners/behind-the-scenes-banner.webp",
                    ),
                    thumbnailAsset: personaAssetUrl(
                      "content-mode/thumbs/behind-the-scenes-thumb.webp",
                      "content-mode/thumbs/behind-the-scenes-thumb.webp",
                    ),
                  },
                  {
                    title: "Product Showcase",
                    brief:
                      "Highlight features, benefits, and real-world use cases so people understand what you offer and why it matters.",
                    recommendReason: "Shortens the path from discovery to consideration for buyers.",
                    isRecommended: false,
                    icon: "📦",
                    slug: "product-showcase",
                    bannerAsset: personaAssetUrl(
                      "content-mode/banners/product-showcase-banner.webp",
                      "content-mode/banners/product-showcase-banner.webp",
                    ),
                    thumbnailAsset: personaAssetUrl(
                      "content-mode/thumbs/product-showcase-thumb.webp",
                      "content-mode/thumbs/product-showcase-thumb.webp",
                    ),
                  },
                  {
                    title: "Community Building",
                    brief:
                      "Spark conversations, celebrate customers, and create content that invites people to participate—not just watch.",
                    recommendReason: "Grows loyalty and turns followers into advocates.",
                    isRecommended: false,
                    icon: "🤝",
                    slug: "community-building",
                    bannerAsset: personaAssetUrl(
                      "content-mode/banners/community-building-banner.webp",
                      "content-mode/banners/community-building-banner.webp",
                    ),
                    thumbnailAsset: personaAssetUrl(
                      "content-mode/thumbs/community-building-thumb.webp",
                      "content-mode/thumbs/community-building-thumb.webp",
                    ),
                  },
                  {
                    title: "Mixed / Auto",
                    brief:
                      "Let BUZZZED balance formats based on your goals, mixing value, promotion, and personality automatically.",
                    recommendReason: "Keeps your feed fresh without locking into one content style.",
                    isRecommended: false,
                    icon: "🎨",
                    slug: "mixed-auto",
                    bannerAsset: personaAssetUrl(
                      "content-mode/banners/mixed-auto-banner.webp",
                      "content-mode/banners/mixed-auto-banner.webp",
                    ),
                    thumbnailAsset: personaAssetUrl(
                      "content-mode/thumbs/mixed-auto-thumb.webp",
                      "content-mode/thumbs/mixed-auto-thumb.webp",
                    ),
                  },
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
          sideInfo: {
            title: "Compliance Settings",
            description: "",
            items: [
              {
                title: "Industry Rules",
                description:
                  "Select any regulations or restrictions BUZZZED should follow when creating content.",
              },
              {
                title: "Topics to Avoid",
                description:
                  "Block subjects that don't align with your brand, audience, or risk tolerance.",
              },
              {
                title: "Brand Safety Level",
                description:
                  "Control how cautious or bold AI-generated content should be.",
              },
            ],
          },
          sidePanelShortInfo: "Guardrails protect your brand — set them once, they apply everywhere.",
          sortOrder: 3,
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
          sideInfo: {
            title: "Key Dates & Campaigns",
            description: "",
            items: [
              {
                title: "Add Important Dates",
                description:
                  "Include launches, events, promotions, or seasonal campaigns you want content planned around.",
              },
              {
                title: "Provide Context",
                description:
                  "A short description helps BUZZZED create more relevant content and campaign ideas.",
              },
              {
                title: "Plan Ahead",
                description:
                  "Adding future dates allows AI to schedule content and build momentum before key moments.",
              },
            ],
          },
          sidePanelShortInfo: "Key dates unlock launch-campaign templates automatically.",
          sortOrder: 4,
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
                helperText: "Used to generate content around key dates",
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
                helperText: "Used to generate content around key dates",
              },
            },
          ],
        }
      ],
    },
    {
      slug: "channels_cadence",
      label: "Channels & Cadence",
      title: "Choose where and when to publish .",
      sortOrder: 4,
      personaSubComponents: [
        {
          slug: "platform_selection",
          label: "Platforms",
          title: "Platform Selection",
          sideTitle: "Where will you show up?",
          description: "Toggle platforms on. AI tailors format and tone for each one.",
          sideInfo: {
            title: "Platform Selection Tips",
            description: "",
            items: [
              {
                title: "Choose Active Channels",
                description:
                  "Enable only the platforms where you plan to publish consistently.",
              },
              {
                title: "Set Realistic Frequency",
                description:
                  "Select a posting volume your team can maintain long term.",
              },
              {
                title: "Tailor by Platform",
                description:
                  "Different channels serve different goals and audiences—pick the ones that matter most.",
              },
            ],
          },
          sidePanelShortInfo: "Start with 2–3 platforms and expand as you grow.",
          sortOrder: 1,
          personaQuestions: [
            {
              name: "social_feed_platforms",
              fieldType: PersonaFieldType.multi_platform_selector,
              label: "Social Feed",
              isRequired: false,
              fieldConfig: {
                postsPerWeekMin: 1,
                postsPerWeekMax: 14,
                options: [
                  { slug: "instagram", title: "Instagram", categoryLabel: "Social Feed", icon: "instagram" },
                  { slug: "facebook", title: "Facebook", categoryLabel: "Social Feed", icon: "facebook" },
                  { slug: "linkedin", title: "LinkedIn", categoryLabel: "Social Feed", icon: "linkedin" },
                  { slug: "x", title: "X", categoryLabel: "Social Feed", icon: "x" },
                  { slug: "threads", title: "Threads", categoryLabel: "Social Feed", icon: "threads" },
                  { slug: "pinterest", title: "Pinterest", categoryLabel: "Social Feed", icon: "pinterest" }
                ],
              },
            },
            {
              name: "short_form_video_platforms",
              fieldType: PersonaFieldType.multi_platform_selector,
              label: "Short-form Video",
              isRequired: false,
              fieldConfig: {
                postsPerWeekMin: 1,
                postsPerWeekMax: 14,
                options: [
                  { slug: "instagram", title: "Instagram Reels", categoryLabel: "Short-form Video", icon: "instagram" },
                  { slug: "tiktok", title: "TikTok", categoryLabel: "Short-form Video", icon: "tiktok" },
                  { slug: "snapchat", title: "Snapchat Spotlight", categoryLabel: "Short-form Video", icon: "snapchat" },
                  { slug: "youtube", title: "YouTube Shorts", categoryLabel: "Short-form Video", icon: "youtube" },
                ]
              },
            },
            {
              name: "long_form_video_platforms",
              fieldType: PersonaFieldType.multi_platform_selector,
              label: "Long-form Video",
              isRequired: false,
              fieldConfig: {
                postsPerWeekMin: 1,
                postsPerWeekMax: 14,
                options: [
                  { slug: "youtube", title: "YouTube", categoryLabel: "Long-form Video", icon: "youtube" },
                  { slug: "vimeo", title: "Vimeo", categoryLabel: "Long-form Video", icon: "vimeo" },
                ]
              },
            },
            {
              name: "stories_platforms",
              fieldType: PersonaFieldType.multi_platform_selector,
              label: "Stories",
              isRequired: false,
              fieldConfig: {
                postsPerWeekMin: 1,
                postsPerWeekMax: 14,
                options: [
                  { slug: "instagram", title: "Instagram Stories", categoryLabel: "Stories", icon: "instagram" },
                  { slug: "snapchat", title: "Snapchat Stories", categoryLabel: "Stories", icon: "snapchat" },
                ]
              },
            }
          ],
        },
        {
          slug: "schedule",
          label: "Schedule",
          title: "Schedule Preferences",
          sideTitle: "Schedule Preferences",
          description: "When will you post? AI adapts timing per platform automatically.         ",
          sideInfo: {
            title: "What to look for?",
            description:
              "Choose how much control you want over publishing times.",
            items: [
              {
                title: "Posting Schedule",
                description: "Select when content should be published.",
              },
              {
                title: "Posting Window",
                description: "Choose your preferred time of day.",
              },
              {
                title: "Time Zone",
                description:
                  "Content will be scheduled according to this location.",
              },
            ],
          },
          sidePanelShortInfo: "Consistent posting times increase algorithmic reach by up to 40%.",
          sortOrder: 2,
          personaQuestions: [
            {
              name: "content_scheduling_preference",
              fieldType: PersonaFieldType.switch_group,
              label: "How would you like content scheduled?",
              isRequired: true,
              fieldConfig: {
                options: [
                  {
                    value: "automatic",
                    label: "Optimize automatically",
                    description: "BUZZZED will find the best times to post.",
                    isRecommended: true,
                  },
                  {
                    value: "manual",
                    label: "I'll choose my posting schedule",
                    description: "I want to set my own days and times.",
                    isRecommended: false,
                  },
                ],
              },
            },
            {
              name: "posting_days",
              fieldType: PersonaFieldType.group_radio,
              label: "Posting Days",
              isRequired: false,
              fieldConfig: {
                enabledWhen: {
                  question: "content_scheduling_preference",
                  value: "manual",
                },
                requiredWhen: {
                  question: "content_scheduling_preference",
                  value: "manual",
                },
                options: [
                  { value: "daily", label: "Daily" },
                  { value: "weekdays", label: "Weekdays Only" },
                  { value: "weekends", label: "Weekends Only" },
                  { value: "custom", label: "Custom Days" },
                ],
              },
            },
            {
              name: "custom_posting_days",
              fieldType: PersonaFieldType.multi_radio,
              label: "Custom Days",
              isRequired: false,
              fieldConfig: {
                enabledWhen: {
                  question: "posting_days",
                  value: "custom",
                },
                requiredWhen: {
                  question: "posting_days",
                  value: "custom",
                },
                min: 1,
                options: [
                  "Mon",
                  "Tue",
                  "Wed",
                  "Thu",
                  "Fri",
                  "Sat",
                  "Sun",
                ],
              },
            },
            {
              name: "preferred_posting_window",
              fieldType: PersonaFieldType.group_radio,
              label: "Preferred Posting Window",
              isRequired: false,
              fieldConfig: {
                enabledWhen: {
                  question: "content_scheduling_preference",
                  value: "manual",
                },
                requiredWhen: {
                  question: "content_scheduling_preference",
                  value: "manual",
                },
                options: [
                  {
                    value: "morning",
                    label: "Morning",
                    subtitle: "6-10 AM",
                    selectionNote:
                      "We'll prioritize posting between 6:00 AM - 10:00 AM in your time zone.",
                  },
                  {
                    value: "midday",
                    label: "Midday",
                    subtitle: "10 AM-2 PM",
                    selectionNote:
                      "We'll prioritize posting between 10:00 AM - 2:00 PM in your time zone.",
                  },
                  {
                    value: "afternoon",
                    label: "Afternoon",
                    subtitle: "2-6 PM",
                    selectionNote:
                      "We'll prioritize posting between 2:00 PM - 6:00 PM in your time zone.",
                  },
                  {
                    value: "evening",
                    label: "Evening",
                    subtitle: "6-10 PM",
                    selectionNote:
                      "We'll prioritize posting between 6:00 PM - 10:00 PM in your time zone.",
                  },
                  {
                    value: "auto",
                    label: "Let BUZZZED decide",
                  },
                ],
              },
            },
            {
              name: "posting_timezone",
              fieldType: PersonaFieldType.single_dropdown,
              label: "Time Zone",
              isRequired: true,
              fieldConfig: {
                helperText:
                  "All times will be scheduled according to this time zone.",
                options: [
                  { value: "Europe/London", title: "United Kingdom (GMT)" },
                  { value: "Europe/Paris", title: "Central Europe (CET)" },
                  { value: "America/New_York", title: "Eastern Time (US)" },
                  { value: "America/Chicago", title: "Central Time (US)" },
                  { value: "America/Denver", title: "Mountain Time (US)" },
                  { value: "America/Los_Angeles", title: "Pacific Time (US)" },
                  { value: "Asia/Dubai", title: "Gulf Standard Time" },
                  { value: "Asia/Kolkata", title: "India Standard Time" },
                  { value: "Asia/Singapore", title: "Singapore Time" },
                  { value: "Australia/Sydney", title: "Australian Eastern Time" },
                ],
              },
            },
          ]
        },
        {
          slug: "formats",
          label: "Formats",
          title: "Content Formats",
          sideTitle: "Content Formats",
          description: "Select the formats you want BUZZZED to generate.         ",
          sideInfo: {
            title: "Content Format Selection",
            description: "",
            items: [
              {
                title: "Prioritize What Works",
                description:
                  "Select the formats your audience engages with most.",
              },
              {
                title: "Match Platform Behavior",
                description:
                  "Choose formats that fit your selected channels and content strategy.",
              },
              {
                title: "Balance Effort & Impact",
                description:
                  "Mix quick-to-create formats with higher-impact content types.",
              },
            ],
          },
          sidePanelShortInfo: "Carousels drive 3× more profile visits than static images.",
          sortOrder: 3,
          personaQuestions: [
            {
              name: "content_formats",
              fieldType: PersonaFieldType.content_formats,
              label: "Content Formats",
              isRequired: false,
              fieldConfig: {
                options: [
                  {
                    slug: "carousel",
                    title: "Carousel",
                    description: "Multi-slide content perfect for education, tips, and storytelling.",
                  },
                  {
                    slug: "short-form-video",
                    title: "Short-form Video",
                    description: "Reels, Shorts, or TikToks to grab attention and drive engagement.",
                  },
                  {
                    slug: "static-image",
                    title: "Static Image",
                    description: "Eye-catching single image posts with powerful captions.",
                  },
                  {
                    slug: "story",
                    title: "Story",
                    description: "Short, everyday content perfect for engagement and updates.",
                  },
                  {
                    slug: "long-form-video",
                    title: "Long-form Video",
                    description: "In-depth videos for YouTube, webinars, or detailed explanations.",
                  },
                  {
                    slug: "blog-post",
                    title: "Blog Post",
                    description: "SEO-friendly articles that build authority and drive traffic.",
                  },
                  {
                    slug: "newsletter-email",
                    title: "Newsletter Email",
                    description: "Nurture your audience with valuable updates and insights.",
                  },
                  {
                    slug: "poll",
                    title: "Poll",
                    description: "Interactive polls to boost engagement and gather insights.",
                  },
                ]
              }
            }
          ]
        }
      ],
    },
    {
      slug: "design_voice",
      label: "Design & Voice",
      title: "Shape your look and tone.",
      sortOrder: 5,
      personaSubComponents: [
        {
          slug: "colors",
          label: "Colors",
          title: "Brand Colors",
          sideTitle: "Set your brand colors.",
          description: "Set your palette. AI applies these across all generated content.",
          sideInfo: {
            title: "Build Your Color Palette",
            description: "",
            items: [
              {
                title: "Primary Color First",
                description:
                  "Choose the color most associated with your brand.",
              },
              {
                title: "Support With Secondary Colors",
                description:
                  "Use secondary colors for backgrounds, layouts, and visual variety.",
              },
              {
                title: "Use Accent Colors Sparingly",
                description:
                  "Reserve accent colors for buttons, highlights, and key actions.",
              },
            ],
          },
          sidePanelShortInfo: "A 3-color palette keeps content visually cohesive at scale.",
          sortOrder: 1,
          personaQuestions: [
            {
              name: "color_style",
              fieldType: PersonaFieldType.switch_group,
              label: "Color Style",
              isRequired: true,
              fieldConfig: {
                options: [
                  {
                    value: "solid",
                    label: "Solid Colors",
                    description: "Clean and modern look",
                    isRecommended: true,
                  },
                  {
                    value: "gradient",
                    label: "Gradient",
                    description: "Vibrant and dynamic look",
                    isRecommended: false,
                  },
                ],
              },
            },
            {
              name: "brand_palette",
              fieldType: PersonaFieldType.color_palette,
              label: "Brand Palette",
              isRequired: true,
              fieldConfig: {
                suggestedPalettes: [
                  {
                    value: "current",
                    label: "Current Palette",
                    primary: "#3B2F2F",
                    secondary: "#F97316",
                    accent: "#F59E0B",
                  },
                  {
                    value: "high_contrast",
                    label: "High Contrast",
                    primary: "#F97316",
                    secondary: "#F59E0B",
                    accent: "#3B2F2F",
                  },
                  {
                    value: "modern_minimal",
                    label: "Modern Minimal",
                    primary: "#F5E6D3",
                    secondary: "#F97316",
                    accent: "#3B2F2F",
                  },
                  {
                    value: "vibrant_social",
                    label: "Vibrant Social",
                    primary: "#F97316",
                    secondary: "#F5E6D3",
                    accent: "#A8A29E",
                  },
                ],
              },
            },
          ],
        },
        {
          slug: "typography",
          label: "Typography",
          title: "Typography",
          sideTitle: "Choose your typeface.",
          description:
            "Choose your display and body fonts. These appear in every headline AI generates.",
          sideInfo: {
            title: "What to look for?",
            description: "",
            items: [
              {
                title: "Display Font Personality",
                description: "Does this font match how your brand should feel?",
              },
              {
                title: "Headline Impact",
                description: "Will it grab attention in posts and ads?",
              },
              {
                title: "Readability",
                description: "Is it easy to read on all screen sizes?",
              },
              {
                title: "Consistency",
                description: "Does it align with your existing branding?",
              },
            ],
          },
          sidePanelShortInfo: "Typography is 80% of design — choose something that feels like you.",
          sortOrder: 2,
          personaQuestions: [
            {
              name: "display_font",
              fieldType: PersonaFieldType.font_select,
              label: "Display Font",
              isRequired: true,
              fieldConfig: {
                role: "display",
                footnote:
                  "Used for headlines, titles, hero text, and key highlights.",
              },
            },
            {
              name: "body_font",
              fieldType: PersonaFieldType.font_select,
              label: "Body Font",
              isRequired: true,
              fieldConfig: {
                role: "body",
                footnote:
                  "Used for captions, descriptions, and long-form content.",
              },
            },
          ],
        },
        {
          slug: "visual_style",
          label: "Visual Style",
          title: "Build your visual system",
          sideTitle: "Content formats",
          description:
            "Click a content format, then choose a visual style to connect them.",
          sideInfo: {
            title: "What to look for?",
            description: "",
            items: [
              {
                title: "Format–Style Match",
                description:
                  "Choose visual styles that naturally fit each content format.",
              },
              {
                title: "Brand Consistency",
                description:
                  "Keep connected styles aligned with your brand identity and audience expectations.",
              },
              {
                title: "Content Purpose",
                description:
                  "Use different styles strategically for education, promotion, storytelling, or engagement.",
              },
              {
                title: "Connection Coverage",
                description:
                  "Ensure your most important content formats have a defined visual style assigned.",
              },
            ],
          },
          sidePanelShortInfo: "Consistent visuals increase brand recall by 80%.",
          sortOrder: 3,
          personaQuestions: [
            {
              name: "visual_style_mappings",
              fieldType: PersonaFieldType.visual_mapper,
              label: "Visual Style",
              isRequired: true,
              fieldConfig: {
                sourceColumnLabel: "Content Format",
                targetColumnLabel: "Visual Styles",
                sourceOptions: [
                  {
                    id: "static_image",
                    title: "Static Image",
                    description: "Single images for posts",
                    iconAsset: personaAssetUrl(
                      "visual-style/svgs/vs-static-image.svg",
                      "svgs/vs-static-image.svg",
                    ),
                    accentColor: "#EB6442",
                  },
                  {
                    id: "carousel",
                    title: "Carousel",
                    description: "Multi-image carousels",
                    iconAsset: personaAssetUrl(
                      "visual-style/svgs/vs-carousel.svg",
                      "svgs/vs-carousel.svg",
                    ),
                    accentColor: "#9B79FB",
                  },
                  {
                    id: "short_form_video",
                    title: "Short-form Video",
                    description: "Reels, Shorts, TikTok",
                    iconAsset: personaAssetUrl(
                      "visual-style/svgs/vs-short-form-video.svg",
                      "svgs/vs-short-form-video.svg",
                    ),
                    accentColor: "#F88F51",
                  },
                  {
                    id: "long_form_video",
                    title: "Long-form Video",
                    description: "YouTube, webinars, etc.",
                    iconAsset: personaAssetUrl(
                      "visual-style/svgs/vs-long-form-video.svg",
                      "svgs/vs-long-form-video.svg",
                    ),
                    accentColor: "#62CFC9",
                  },
                  {
                    id: "story",
                    title: "Story",
                    description: "Instagram/Facebook stories",
                    iconAsset: personaAssetUrl(
                      "visual-style/svgs/vs-story.svg",
                      "svgs/vs-story.svg",
                    ),
                    accentColor: "#8870E5",
                  },
                  {
                    id: "newsletter_email",
                    title: "Newsletter Email",
                    description: "Email headers & graphics",
                    iconAsset: personaAssetUrl(
                      "visual-style/svgs/vs-newsletter-email.svg",
                      "svgs/vs-newsletter-email.svg",
                    ),
                    accentColor: "#EB79AC",
                  },
                  {
                    id: "blog_post",
                    title: "Blog Post",
                    description: "Blog headers images",
                    iconAsset: personaAssetUrl(
                      "visual-style/svgs/vs-blog-post.svg",
                      "svgs/vs-blog-post.svg",
                    ),
                    accentColor: "#DE836C",
                  },
                  {
                    id: "poll_question",
                    title: "Poll / Question",
                    description: "Polls, questions, interactive",
                    iconAsset: personaAssetUrl(
                      "visual-style/svgs/vs-poll-question.svg",
                      "svgs/vs-poll-question.svg",
                    ),
                    accentColor: "#5F98D0",
                  },
                ],
                targetOptions: [
                  {
                    id: "minimalist",
                    title: "Minimalist",
                    description: "Clean lines, whitespace, restrained color",
                    thumbnailAsset: personaAssetUrl(
                      "visual-style/thumbnails/minimalist.png",
                      "minimalist.png",
                    ),
                  },
                  {
                    id: "bold_vibrant",
                    title: "Bold & Vibrant",
                    description: "High contrast, saturated colors, strong type",
                    thumbnailAsset: personaAssetUrl(
                      "visual-style/thumbnails/bold-vibrant.png",
                      "bold-vibrant.png",
                    ),
                  },
                  {
                    id: "luxury_premium",
                    title: "Luxury / Premium",
                    description: "Dark palettes, gold accents, premium feel",
                    thumbnailAsset: personaAssetUrl(
                      "visual-style/thumbnails/luxury-premium.png",
                      "luxury-premium.png",
                    ),
                  },
                  {
                    id: "human_founder_led",
                    title: "Human / Founder-Led",
                    description: "Real people, candid moments, warmth",
                    thumbnailAsset: personaAssetUrl(
                      "visual-style/thumbnails/human-founder-led.png",
                      "human-founder-led.png",
                    ),
                  },
                  {
                    id: "corporate_clean",
                    title: "Corporate Clean",
                    description: "Professional, structured, trust-building",
                    thumbnailAsset: personaAssetUrl(
                      "visual-style/thumbnails/corporate-clean.png",
                      "corporate-clean.png",
                    ),
                  },
                  {
                    id: "creative_artistic",
                    title: "Creative / Artistic",
                    description: "Expressive, unconventional, design-forward",
                    thumbnailAsset: personaAssetUrl(
                      "visual-style/thumbnails/creative-artistic.png",
                      "creative-artistic.png",
                    ),
                  },
                  {
                    id: "dark_moody",
                    title: "Dark & Moody",
                    description: "Deep tones, dramatic lighting, cinematic",
                    thumbnailAsset: personaAssetUrl(
                      "visual-style/thumbnails/dark-moody.png",
                      "dark-moody.png",
                    ),
                  },
                ],
              },
            },
          ],
        },
        {
          slug: "ai_autonomy",
          label: "AI Autonomy",
          title: "AI Design Autonomy",
          sideTitle: "AI design autonomy.",
          description:
            "Control how much creative freedom the AI has with your visuals.",
          sideInfo: {
            title: "What to look for?",
            description: "",
            items: [
              {
                title: "Full Freedom",
                description:
                  "Allows BUZZZED to experiment with layouts, imagery, and design styles.",
              },
              {
                title: "Balanced",
                description:
                  "Keeps your brand recognizable while improving creativity and engagement.",
              },
              {
                title: "Minimal Changes",
                description:
                  "Uses your existing visual style with only small enhancements.",
              },
              {
                title: "Strict Brand Control",
                description:
                  "Follows your brand guidelines as closely as possible.",
              },
            ],
          },
          sidePanelShortInfo:
            "More freedom = more creative variety. Strict = consistent brand.",
          sortOrder: 4,
          personaQuestions: [
            {
              name: "photo_treatment_freedom",
              fieldType: PersonaFieldType.single_dropdown,
              label: "Photo Treatment Freedom",
              isRequired: true,
              fieldConfig: {
                options: ["strict", "minimal", "balanced", "full_freedom"],
                levels: [
                  {
                    id: "strict",
                    label: "Strict",
                    imageSrc: personaAssetUrl(
                      "ai-design-autonomy/cards/strict.png",
                      "/media/onboarding/ai-design-autonomy/cards/strict.png",
                    ),
                  },
                  {
                    id: "minimal",
                    label: "Minimal Changes",
                    imageSrc: personaAssetUrl(
                      "ai-design-autonomy/cards/minimal.png",
                      "/media/onboarding/ai-design-autonomy/cards/minimal.png",
                    ),
                  },
                  {
                    id: "balanced",
                    label: "Balanced",
                    imageSrc: personaAssetUrl(
                      "ai-design-autonomy/cards/balanced.png",
                      "/media/onboarding/ai-design-autonomy/cards/balanced.png",
                    ),
                    recommended: true,
                  },
                  {
                    id: "full_freedom",
                    label: "Full Freedom",
                    imageSrc: personaAssetUrl(
                      "ai-design-autonomy/cards/full-freedom.png",
                      "/media/onboarding/ai-design-autonomy/cards/full-freedom.png",
                    ),
                  },
                ],
              },
            },
          ],
        },
        {
          slug: "caption_prefs",
          label: "Caption Prefs",
          title: "Caption Preferences",
          sideTitle: "Caption preferences.",
          description:
            "Set how your captions look and feel across all platforms.",
          sideInfo: {
            title: "What to look for?",
            description: "",
            items: [
              {
                title: "Caption Length",
                description: "Choose how detailed you want your captions to be.",
              },
              {
                title: "CTA Style",
                description:
                  "Select how BUZZZED should encourage engagement and action.",
              },
              {
                title: "Hashtag Strategy",
                description:
                  "Control how hashtags are used to support reach and branding.",
              },
              {
                title: "Consistency",
                description:
                  "These preferences will be applied across all generated captions.",
              },
            ],
          },
          sidePanelShortInfo: "Caption style is one of the most impactful brand consistency signals.",
          sortOrder: 5,
          personaQuestions: [
            {
              name: "caption_length",
              fieldType: PersonaFieldType.single_dropdown,
              label: "Caption Length",
              isRequired: true,
              fieldConfig: {
                options: [
                  "Short (10 - 15 words)",
                  "Medium (15 - 30 words)",
                  "Long (30+ words)",
                ],
              },
            },
            {
              name: "cta_style",
              fieldType: PersonaFieldType.multi_radio,
              label: "CTA Style",
              isRequired: true,
              fieldConfig: {
                min: 1,
                max: null,
                options: [
                  "Soft (no CTA)",
                  "Educational",
                  "Urgency",
                  'Direct ("buy now")',
                  "Curiosity",
                  "Comment-driven",
                  "DM-driven",
                ],
              },
            },
            {
              name: "hashtag_strategy",
              fieldType: PersonaFieldType.single_dropdown,
              label: "Hashtag Strategy",
              isRequired: true,
              fieldConfig: {
                options: [
                  "None",
                  "Branded only",
                  "Branded + trending",
                  "Full mix",
                ],
              },
            },
            {
              name: "emoji_density",
              fieldType: PersonaFieldType.single_dropdown,
              label: "Emoji Density",
              isRequired: true,
              fieldConfig: {
                options: ["None", "Low", "Medium", "High"],
              },
            },
          ],
        },
        {
          slug: "approval",
          label: "Approval",
          title: "Approval Workflow",
          sideTitle: "Approval workflow.",
          description: "How should content be approved before publishing?",
          sideInfo: {
            title: "What to look for?",
            description: "",
            items: [
              {
                title: "Approval Mode",
                description:
                  "Choose who should review content before it goes live.",
              },
              {
                title: "Approver Email",
                description:
                  "Make sure the correct teammate receives approval requests.",
              },
              {
                title: "Publishing Speed",
                description:
                  "Balance faster publishing with the level of oversight you need.",
              },
              {
                title: "Auto-Publish",
                description:
                  "Enable this if approved content should be published automatically.",
              },
            ],
          },
          sidePanelShortInfo: "Solo mode publishes immediately after your approval.",
          sortOrder: 6,
          personaQuestions: [
            {
              name: "approval_mode",
              fieldType: PersonaFieldType.icon_choice_cards,
              label: "Approval mode",
              isRequired: true,
              fieldConfig: {
                options: [
                  {
                    title: "Solo",
                    brief: "I review and BUZZZED publishes.",
                    icon: "solo",
                    slug: "solo",
                  },
                  {
                    title: "Hold for my approval",
                    brief: "Nothing gets published until I approve it.",
                    icon: "hold_for_approval",
                    slug: "hold_for_approval",
                  },
                  {
                    title: "Send to teammate first",
                    brief: "A teammate reviews content before it goes live.",
                    icon: "send_to_teammate_first",
                    slug: "send_to_teammate_first",
                  },
                ],
              },
            },
            {
              name: "approver_email",
              fieldType: PersonaFieldType.text,
              label: "Approver Email",
              isRequired: false,
              fieldConfig: {
                enabledWhen: {
                  question: "approval_mode",
                  value: "send_to_teammate_first",
                },
                requiredWhen: {
                  question: "approval_mode",
                  value: "send_to_teammate_first",
                },
                max: 250,
                placeholder: "teammate@company.com",
              },
            },
            {
              name: "auto_publish_after_approval",
              fieldType: PersonaFieldType.switch,
              label: "Auto-publish after approval?",
              isRequired: false,
              fieldConfig: {
                options: ["true", "false"],
              },
            },
          ],
        },
        {
          slug: "brand_assets",
          label: "Brand Assets",
          title: "Brand Assets",
          sideTitle: "Upload brand assets.",
          description:
            "Optional — brand kit upload auto-populates colors and fonts in the next steps.",
          sideInfo: {
            title: "What to look for?",
            description: "",
            items: [
              {
                title: "Logo Quality",
                description:
                  "Upload a clear, high-resolution logo for the best results.",
              },
              {
                title: "Brand Guidelines",
                description:
                  "Add your brand kit to help AI follow your colors, fonts, and design rules.",
              },
              {
                title: "Auto-Detection",
                description:
                  "Uploaded assets can automatically populate brand settings.",
              },
              {
                title: "Keep It Consistent",
                description:
                  "The more brand assets you provide, the more accurate your content will be.",
              },
            ],
          },
          sidePanelShortInfo: "Brand kit upload auto-populates fonts and colors in the next steps.",
          sortOrder: 7,
          personaQuestions: [
            {
              name: "logo_upload",
              fieldType: PersonaFieldType.file_upload_multiple,
              label: "Logo Upload",
              isRequired: false,
              fieldConfig: {
                max: 5,
                sizeLimit: 10485760,
                allowedFileTypes: [
                  "image/png",
                  "image/jpeg",
                  "image/svg+xml",
                ],
              },
            },
            {
              name: "brand_kit_upload",
              fieldType: PersonaFieldType.file_upload_multiple,
              label: "Brand Kit Upload",
              isRequired: false,
              fieldConfig: {
                max: 1,
                sizeLimit: 26214400,
                allowedFileTypes: [
                  "application/pdf",
                  "application/zip",
                  "application/x-zip-compressed",
                ],
              },
            },
          ],
        },
      ],
    },
  ],
} satisfies PersonaSchemaSeed;
