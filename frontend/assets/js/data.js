window.CV_DATA = {
  business: {
    name: "Cerberus Visuals",
    base: "Newark, NJ",
    reasonableTravel: "90 minutes of travel time from Newark, NJ",
    bookingEmail: "booking@yourdomain.com",
    creditLine: "Credit: Cerberus Visuals (@yourhandle)"
  },

  packages: [
    {
      id: "live",
      name: "Live Performance",
      price: 500,
      description: "Performance video that feels like a live session. Mic in frame, strong presence, quick turnaround.",
      bestFor: "Quick releases, singles, freestyles.",
      includes: [
        "1 location (within reasonable distance)",
        "2–3 angle shots",
        "1 day shoot (2–4 hours)",
        "1 revision round",
        "Basic color grade + stabilization",
        "Export in 4K (or 1080p)"
      ],
      timeline: [
        "First cut within 3–5 days after final shooting day",
        "Final delivery within 1–3 days after receiving revision notes (per round)"
      ]
    },
    {
      id: "copper",
      name: "Copper",
      price: 1000,
      description: "One-location music video with intentional shots, movement, and angles.",
      bestFor: "Strong main video with minimal complexity.",
      includes: [
        "1-day shoot (2–6 hours)",
        "1 location (within reasonable distance)",
        "2 revision rounds",
        "Basic color grade + stabilization",
        "Export in 4K (or 1080p)"
      ],
      timeline: [
        "First cut within 3–5 days of final shooting day",
        "Final delivery within 1–3 days after receiving revision notes (per round)"
      ]
    },
    {
      id: "iron",
      name: "Iron",
      price: 2500,
      description: "Multi-location video with more variety, coverage, and a stronger concept.",
      bestFor: "Concept releases or multiple environments.",
      includes: [
        "Up to 12 total on-set hours across up to 3 days",
        "Up to 3 locations within reasonable distance",
        "2 revision rounds",
        "Basic color grade + stabilization",
        "Export in 4K (or 1080p)"
      ],
      timeline: [
        "First cut within 4–6 days of final shooting day",
        "Final delivery within 1–3 days after receiving revision notes (per round)"
      ]
    },
    {
      id: "diamond",
      name: "Diamond",
      price: 5000,
      description: "Multi-day production for complex blocking, transitions, and polish.",
      bestFor: "Narrative concepts, performance + story hybrid.",
      includes: [
        "Up to 20 total on-set hours across up to 5 days",
        "Up to 5 locations within reasonable distance",
        "Up to 3 basic VFX shots",
        "3 revision rounds",
        "Basic color grade + stabilization",
        "Export in 4K (or 1080p)"
      ],
      timeline: [
        "First cut within 5–7 days of final shooting day",
        "Final delivery within 1–3 days after receiving revision notes (per round)"
      ]
    }
  ],

  // Estimator uses checkboxes; only fixed-price items add to total.
  addons: [
    { id: "photo", name: "Photography (50 photos + 10 retouched)", price: 200, type: "fixed" },
    { id: "bts_raw", name: "Behind the Scenes (unedited)", price: 150, type: "fixed" },
    { id: "bts_edit", name: "Edited BTS Reel", price: 150, type: "fixed" },
    { id: "clipping_subs", name: "Clipping w/ subtitles (package add-on)", price: 100, type: "fixed" },
    { id: "extra_location", name: "Additional Location", price: 200, type: "fixed" },
    { id: "hard_drive", name: "Hard-drive", price: 50, type: "fixed" },

    // quoted/range items (checkbox adds note to estimate summary)
    { id: "makeup", name: "Make-up", priceNote: "starting $80–$120/day", type: "quoted" },
    { id: "actor_model", name: "Actor/Model", priceNote: "starting $120/day", type: "quoted" },
    { id: "raw_footage", name: "RAW Footage Delivery", priceNote: "$150–$500 (depends on package)", type: "quoted" },
    { id: "props", name: "Props", priceNote: "depends on what’s needed", type: "quoted" },
    { id: "permits", name: "Permits", priceNote: "depends on location", type: "quoted" },
    { id: "transport", name: "Parking/Tolls/Transport", priceNote: "varies", type: "quoted" },
    { id: "lyric_video", name: "Lyric Video", priceNote: "$100–$300", type: "quoted" },
    { id: "visualizer", name: "Visualizer", priceNote: "$50–$150", type: "quoted" }
  ],

  postOnly: [
    { name: "Video Editing (you send footage + song)", priceNote: "$300–$600" },
    { name: "Clipping w/ subtitles — 3 clips (up to 20s each)", priceNote: "$100" },
    { name: "Clipping w/ subtitles — 6 clips (up to 20s each)", priceNote: "$175" },
    { name: "Clipping w/ subtitles — 10 clips (up to 20s each)", priceNote: "$250" },
    { name: "Color Grading", priceNote: "$100 per minute of footage" }
  ],

  rules: [
    { title: "Credit", items: ["Credit is required when you post our work.", "We provide the exact credit line for captions/descriptions."] },
    { title: "Payments", items: ["50% to book, 50% before final delivery."] },
    { title: "Revisions", items: ["Revisions happen in rounds; send a complete list per round.", "Additional revision: $150."] },
    { title: "Rush", items: ["Rush delivery: $200/day (up to $600)."] }
  ],

  team: [
    {
      initials: "RA",
      name: "Richard Aires",
      role: "Director / Writer / Editor / Photographer",
      bio: "EDIT THIS: Short bio about your role and style.",
      photo: "assets/images/team-jose.jpg", // <-- put your real image here
      links: [{ label: "Instagram", url: "#" }]
    },
    {
      initials: "EA",
      name: "Essa Alavi",
      role: "Director / Editor / Colorist",
      bio: "EDIT THIS: Short bio.",
      photo: "assets/images/team-editor.jpg",
      links: [{ label: "Portfolio", url: "#" }]
    },
    {
      initials: "DO",
      name: "David Ortega",
      role: "Music Producer / Sound Designer",
      bio: "EDIT THIS: Short bio.",
      photo: "assets/images/team-dp.jpg",
      links: [{ label: "Instagram", url: "https://www.instagram.com/aytayga_" }]
    }
  ],

  talent: [
    {
      name: "Talent Name 1",
      role: "Model",
      location: "Newark, NJ",
      vibe: ["Fashion", "Performance"],
      skills: ["On-camera", "Lip-sync"],
      contact: "talent@yourdomain.com",
      photo: "assets/images/talent-1.jpg"
    },
    {
      name: "Talent Name 2",
      role: "Actor",
      location: "NYC, NY",
      vibe: ["Narrative", "Drama"],
      skills: ["Acting", "Improvisation"],
      contact: "talent@yourdomain.com",
      photo: "assets/images/talent-2.jpg"
    }
  ]
};