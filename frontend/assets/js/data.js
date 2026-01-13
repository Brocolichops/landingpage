window.CV_DATA = {
  business: {
    name: "Radial Shot",
    base: "Newark, NJ",
    reasonableTravel: "90 minutes of travel time from Newark, NJ",
    bookingEmail: "booking@yourdomain.com",
    creditLine: "Credit: Radial Shot (@yourhandle)"
  },

  packages: [
    {
      id: "live",
      name: "Live Performance",
      price: 500,
      description: "Performance video that feels like a live session. Mic in frame. Strong presence.",
      bestFor: "Quick releases, singles, freestyles.",
      includes: [
        "1 Location",
        "2–3 Angle Shots",
        "1 Day Shoot (2–4 hours)",
        "1 Revision Round",
        "Basic Color Grade + Stabilization",
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
      description: "One-location music video with eye-catching shots, movement, and angles.",
      bestFor: "Strong main video with minimal complexity.",
      includes: [
        "1 Day Shoot (2–6 hours)",
        "1 Location",
        "2 Revision Rounds",
        "Basic Color Grade + Stabilization",
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
        "Up to 3 Locations",
        "2 Revision Rounds",
        "Color Grade + Stabilization",
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
        "Up to 5 Locations",
        "Up to 3 Basic VFX shots",
        "3 Revision Rounds",
        "Color Grade + Stabilization",
        "Export in 4K (or 1080p)"
      ],
      timeline: [
        "First cut within 5–8 days of final shooting day",
        "Final delivery within 1–3 days after receiving revision notes (per round)"
      ]
    }
  ],
  /*
  bundles: [
      {
        name: "Starter Rollout Bundle",
        price: 300,
        includes: ["1 teaser (15–30s)", "6 vertical clips (with captions)", "20 photos", "1 cover-art option"]
      },
      {
        name: "Social Media Bundle",
        price: 450,
        includes: ["30 photographs", "10 vertical short form (with captions)", "1 teaser video (15–30s)"]
      }
    ]
  */
  // Estimator uses checkboxes; only fixed-price items add to total.
  // quoted/range items (checkbox adds note to estimate summary)
  addons: [
    
    { id: "bts_raw", name: "Behind the Scenes (unedited)", price: 150, type: "fixed" },
    { id: "bts_edit", name: "Edited BTS Reel", price: 150, type: "fixed" },
    { id: "hard_drive", name: "Hard-drive", price: 75, type: "fixed" },

    
    { id: "photo", name: "Photography", priceNote: "$200 per 50 delivered photos", type: "quoted" },
    { id: "extra_location", name: "Additional Location", priceNote: "depends on location + schedule", type: "quoted" },
    { id: "clipping_subs", name: "Clipping w/ subtitles", priceNote: "$100 per 10 clips", type: "quoted" },
    { id: "makeup", name: "Make-up", priceNote: "$80–$120/day", type: "quoted" },
    { id: "actor_model", name: "Actor/Model", priceNote: "starting $120/day", type: "quoted" },
    { id: "raw_footage", name: "RAW Footage Delivery", priceNote: "$150–$500 (depends on package)", type: "quoted" },
    { id: "props", name: "Props", priceNote: "depends on what’s needed", type: "quoted" },
    { id: "permits", name: "Permits", priceNote: "depends on location", type: "quoted" },
    { id: "transport", name: "Parking/Tolls/Transport", priceNote: "varies", type: "quoted" },
    { id: "lyric_video", name: "Lyric Video", priceNote: "$100–$300", type: "quoted" },
    { id: "visualizer", name: "Visualizer", priceNote: "$50–$150", type: "quoted" },
    { id: "confidentiality", name: "Confidentiality Add-on", priceNote: "depends on project", type: "quoted" },
    { id: "basic_vfx", name: "Basic VFX", priceNote: "$100/second*", type: "quoted" },
    { id: "advanced_vfx", name: "Advanced VFX", priceNote: "$200/second*", type: "quoted" }
    
  ],

  postOnly: [
    { name: "Video Editing (footage + song)", priceNote: "$300–$600" },
    { name: "Clipping w/ Subtitles (up to 59s each)", priceNote: "Depends on quantity" },
    { name: "Color Grading (from correction to stylized)", priceNote: "Depends on project" }
  ],

  rules: [
    { title: "Payments", items: ["50% to book, 50% before final delivery."] },
    { title: "Overtime", items: ["Overtime is billed at $150/hour for any hours beyond the included hours in the package."] },
    { title: "On-Set Expectations", items: ["Artist arrives on time, brings wardrobe, confirms locations.", "Tardiness eats into included hours (overtime applies).", "No illegal trespassing, no weapons, no dangerous stunts without proper safety plan."] },
    { title: "Credit", items: ["Credit is required when you post our work.", "Client grants permission to use final video + BTS for portfolio/marketing unless there's a confidentiality add-on.", "We will not post unreleased work before the release date (if provided in writing)."] },
    { title: "Copyright", items: ["We retain copyright to all footage and edits until full payment is received.", "We may use the work for promotional purposes."] },
    { title: "Revisions", items: ["Revisions happen in rounds; send a complete list of notes per round.", "Additional revision: $150."] },
    { title: "Props", items: ["Company-brought props/wardrobe/set dressing remain company property", "Client-purchased props (from client budget) belong to client unless otherwise agreed in writing"] },
    { title: "Reschedule", items: ["One free reschedule if 7+ days notice", "Within 7 days: $250 reschedule fee + vendor costs (if applicable)"] },
    { title: "Cancellation", items: ["14+ days cancellation: booking retainer kept; 50% can be used as credit within 60 days (one-time)", "7–13 days: booking retainer kept (no credit) + vendor costs (if applicable).", "Less than 7 days: booking retainer kept + 50% of remaining balance + vendor costs (if applicable)."] },
    { title: "Liability", items: ["Company is not liable for any injuries or damages that occur during the production process.", "Client is responsible for ensuring a safe environment and following all applicable laws and regulations."] },
    { title: "Deliverables", items: ["Final Music Video length = full song length (unless otherwise agreed)", "Final deliverables include the final video in 4K (or 1080p) and any additional deliverables specified in the package or add-ons.", "Includes 1 master export (16:9). Vertical exports (9:16) upon request."]}
  ],

  team: [
    {
      initials: "RA",
      name: "Richard Aires",
      role: "Director / Writer / Editor / Photographer",
      bio: "Film director, writer, editor, and photographer.",
      photo: "assets/images/richard_insta.jpg",
      links: [{ label: "Instagram", url: "#" }]
    },
    {
      initials: "EA",
      name: "Essa Alavi",
      role: "Director / Editor / Colorist",
      bio: "Film director, editor, and colorist.",
      photo: "assets/images/essa_insta.png",
      links: [{ label: "Portfolio", url: "#" }]
    },
    {
      initials: "DO",
      name: "David Ortega",
      role: "Music Producer / Sound Designer",
      bio: "Music producer, songwriter, and sound designer.",
      photo: "assets/images/david_random.jpg",
      links: [{ label: "Insta: @aytayga_", url: "https://www.instagram.com/aytayga_" }]
    }
  ],

  talent: [
    {
      name: "Essa Alavi",
      role: "Actor / Model",
      location: "Woodbridge, NJ",
      vibe: ["Versatile", "All Energies"],
      skills: ["Acting", "Improvisation"],
      photo: "assets/images/essa_insta.png"
    },
    {
      name: "Richard Aires",
      role: "Actor / Model",
      location: "Hillside, NJ",
      vibe: ["Narrative", "Drama"],
      skills: ["Acting", "Improvisation"],
      photo: "assets/images/richard_insta.jpg"
    },
    {
      name: "David Ortega",
      role: "Actor / Model",
      location: "Millburn, NJ",
      vibe: ["Versatile", "All Energies"],
      skills: ["Acting", "Improvisation"],
      photo: "assets/images/david_random.jpg"
    }
  ]
};