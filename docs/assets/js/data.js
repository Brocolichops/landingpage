window.CV_DATA = {
  business: {
    name: "Aux Pictures",
    base: "Newark, NJ",
    reasonableTravel: "90 minutes of travel time from Newark, NJ",
    bookingEmail: "realauxpictures@gmail.com",
    creditLine: "Credit: Aux Pictures (@auxpictures)",
    backendURL: "https://landingpage-f6n9.onrender.com"  // Updated to Render backend URL
  },

  homeSlides: [
    { src: "assets/images/Yearn_slide.png", alt: "Yearn still 1", caption: "'Yearn' opening shot." },
    { src: "assets/images/Blue_hour_slide.png", alt: "Blue Hour still 1", caption: "Nightmare scene in 'Blue Hour'." },
    { src: "assets/images/Blue_hour_slide2.png", alt: "Blue Hour still 2", caption: "Still from 'Blue Hour'." },
    { src: "assets/images/Happy_before_slide.JPEG", alt: "Happy Before still 1", caption: "Shot from 'Happy Before'." }
  ],

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

  bundles: [
    {
      id: "starter_rollout",
      name: "Starter Rollout Bundle",
      price: 300,
      desc: "A lightweight rollout pack for announcements and momentum.",
      includes: ["1 teaser (15–30s)", "6 vertical clips (w/ captions)", "20 photos", "1 cover-art option"]
    },
    {
      id: "social_bundle",
      name: "Social Media Bundle",
      price: 450,
      desc: "More frequent posting support built around your release.",
      includes: ["30 photos", "10 vertical short-form (w/ captions)", "1 teaser video (15–30s)"]
    }
  ],

  // Estimator: fixed items add full price; quoted items add minimum price to total.
  addons: [
    { id: "bts_raw", name: "Behind the Scenes (unedited)", type: "fixed", price: 150, minPrice: 150, desc: "Unedited BTS footage delivered as-is." },
    { id: "bts_edit", name: "Edited BTS Reel", type: "fixed", price: 150, minPrice: 150, desc: "A cut-down BTS reel ready for posting." },
    { id: "hard_drive", name: "Hard-drive", type: "fixed", price: 75, minPrice: 75, desc: "Physical drive with selected package/add-on files." },

    { id: "photo", name: "Photography", type: "quoted", priceNote: "$200 per 50 delivered photos", minPrice: 200, desc: "Stills captured during production." },
    { id: "clipping_subs", name: "Clipping w/ subtitles", type: "quoted", priceNote: "$100 per 10 clips", minPrice: 100, desc: "Short-form edits with captions/subtitles." },
    { id: "makeup", name: "Make-up", type: "quoted", priceNote: "$80–$120/day", minPrice: 80, desc: "Look good for the camera." },

    /* Actor/Model: link to talent page (keeps estimate via localStorage) */
    { id: "actor_model", name: "Actor/Model", type: "quoted", priceNote: "Starting $120/day/talent", minPrice: 120, desc: "Select talent from our roster.", linkUrl: "talent.html", linkLabel: "View roster" },

    { id: "raw_footage", name: "RAW Footage Delivery", type: "quoted", priceNote: "$150–$500 (depends on package)", minPrice: 150, desc: "Raw files delivered." },
    /*
    { id: "props", name: "Props", type: "quoted", priceNote: "Depends on what’s needed", minPrice: 0, desc: "Props/set dressing (we confirm based on concept)." },
    { id: "permits", name: "Permits", type: "quoted", priceNote: "Depends on location", minPrice: 0, desc: "Permit costs vary by city/location." },
    { id: "transport", name: "Parking/Tolls/Transport", type: "quoted", priceNote: "Varies", minPrice: 0, desc: "Travel-related costs (as needed)." },
    */
    { id: "lyric_video", name: "Lyric Video", type: "quoted", priceNote: "$100–$300", minPrice: 100, desc: "Lyrics synced + stylized (basic to premium)." },
    { id: "visualizer", name: "Visualizer", type: "quoted", priceNote: "$50–$150", minPrice: 50, desc: "Looping visual for promo/posting." },
    { id: "confidentiality", name: "Confidentiality Add-on", type: "quoted", priceNote: "Depends on project", minPrice: 0, desc: "Limits portfolio/marketing usage (case-by-case)." },

    { id: "basic_vfx", name: "Basic VFX", type: "quoted", priceNote: "$100/second*", minPrice: 100, desc: "Cleanup or simple effects (*priced by final seconds)." },
    { id: "advanced_vfx", name: "Advanced VFX", type: "quoted", priceNote: "$200/second*", minPrice: 200, desc: "Composites/advanced work (*priced by final seconds)." }
  ],

  /* Post-only services are selectable in estimator (multiple) */
  
  postOnly: [
    { id: "post_edit", name: "Video Editing (Footage + Song)", priceNote: "Based On Project", minPrice: 300, desc: "We shape your footage into a finished cut." },
    { id: "post_clips", name: "Clips w/ Subtitles (up to 59s each)", priceNote: "Per 10 Clips", minPrice: 100, desc: "Short-form clips formatted for socials." },
    { id: "post_color", name: "Color Grading (correction → stylized)", priceNote: "Based On Project", minPrice: 150, desc: "Color work to elevate the final look." }
  ],

  rules: [
    { title: "Payments", items: ["50% to book, 50% before final delivery."] },
    { title: "Overtime", items: ["Overtime is billed at $150/hour for any hours beyond the included hours in the package."] },
    { title: "On-Set Expectations", items: ["Artist arrives on time, brings wardrobe, confirms locations.", "Tardiness eats into included hours (overtime applies).", "No illegal trespassing, no weapons, no dangerous stunts without proper safety plan."] },
    { title: "Credit", items: ["Credit is required when you post our work.", "Client grants permission to use final video + BTS for portfolio/marketing unless there's a confidentiality add-on.", "We will not post unreleased work before the release date (if provided in writing)."] },
    { title: "Copyright", items: ["We retain copyright to all footage and edits until full payment is received.", "We may use the work for promotional purposes."] },
    { title: "Revisions", items: ["Revisions happen in rounds; send a complete list of notes per round.", "Additional revision: $150."] },
    { title: "Props", items: ["Company-brought props/wardrobe/set dressing remain company property.", "Client-purchased props belong to client unless otherwise agreed in writing."] },
    { title: "Reschedule", items: ["One free reschedule if 7+ days notice.", "Within 7 days: $250 reschedule fee + vendor costs (if applicable)."] },
    { title: "Cancellation", items: ["14+ days cancellation: booking retainer kept; 50% can be used as credit within 60 days (one-time)", "7–13 days: booking retainer kept (no credit) + vendor costs (if applicable).", "Less than 7 days: booking retainer kept + 50% of remaining balance + vendor costs (if applicable)."] },
    { title: "Liability", items: ["Company is not liable for any injuries or damages that occur during the production process.", "Client is responsible for ensuring a safe environment and following all applicable laws and regulations."] },
    { title: "Deliverables", items: ["Final Music Video length = full song length (unless otherwise agreed)", "Final deliverables include the final video in 4K (or 1080p) and any additional deliverables specified in the package or add-ons.", "Includes 1 master export (16:9). Vertical exports (9:16) upon request."]},
    { title: "Additional Costs", items: ["Price depends on specific circumstances:", "Extra Location", "Props", "Permits", "Parking/Tolls/Transport"] }
  ],

  team: [
    {
      id: "richard",
      name: "Richard Aires",
      role: "Director / Writer / Editor / Photographer",
      bio: "Directs and edits with a focus on pacing, coverage, and clarity.",
      photo: "assets/images/richard_insta.jpg",
      links: [{ label: "Insta: @aires.productions", url: "https://www.instagram.com/aires.productions" }]
    },
    {
      id: "essa",
      name: "Essa Alavi",
      role: "Director / Editor / Colorist",
      bio: "Draws inspiration from multiple cultures to create visually engaging stories.",
      photo: "assets/images/essa_profile.jpg",
      links: [{ label: "Insta: @alavi.productions", url: "https://www.instagram.com/alavi.productions" }]
    },
    {
      id: "david",
      name: "David Ortega",
      role: "Music Producer / Sound Designer",
      bio: "Just a chiller :P",
      photo: "assets/images/aytayga_profile.jpg",
      links: [{ label: "Insta: @aytayga_", url: "https://www.instagram.com/aytayga_" }]
    }
  ],

  talent: [
    {
      id: "talent_essa",
      name: "Essa Alavi",
      role: "Actor / Model",
      location: "Woodbridge, NJ",
      vibe: ["Versatile", "All Energies"],
      skills: ["Acting", "Improvisation"],
      photos: ["assets/images/Essa_model1.jpeg", "assets/images/Essa_model2.jpg"]
    },
    {
      id: "talent_richard",
      name: "Richard Aires",
      role: "Actor / Model",
      location: "Hillside, NJ",
      vibe: ["Narrative", "Drama"],
      skills: ["Acting", "Improvisation"],
      photos: ["assets/images/richard_photo2.jpg", "assets/images/richard_photo1.jpg"]
    },
    {
      id: "talent_david",
      name: "David Ortega",
      role: "Actor / Model",
      location: "Millburn, NJ",
      vibe: ["Casual", "Relaxed"],
      skills: ["Acting", "Improvisation"],
      photos: ["assets/images/david_selfie.jpg", "assets/images/David_model2.jpg"]
    }
  ]
};