export const products = [
  {
    id: 'bulb-aura-smart',
    name: 'Aura Smart LED Bulb',
    description: '16M color LED lighting with thread app control and seamless smart ecosystem scheduling.',
    longDescription: 'Immerse your space in the ultimate premium lighting experience. The Aura Smart LED Bulb delivers up to 1100 lumens of pure, flicker-free light across a spectrum of 16 million colors and tunable whites (1800K - 6500K). Designed with premium high-index LEDs, it features advanced Thread and Zigbee protocols alongside dual-band Wi-Fi. Set automated schedules, dynamic lighting transitions, or sync it with your music or gaming setups for visual wonder.',
    price: 29.99,
    rating: 4.8,
    reviewsCount: 142,
    badge: 'Best Seller',
    category: 'Lighting',
    stock: 24,
    image: 'https://images.unsplash.com/photo-1550985616-10810253b84d?auto=format&fit=crop&w=600&q=80',
    specs: {
      voltage: '110V - 240V AC',
      lifespan: '25,000 Hours',
      protocol: 'Thread, Zigbee, BLE, Wi-Fi',
      wattage: '9W (Equivalent to 75W Incandescent)',
      lumens: '1100 lm',
      dimensions: '60mm x 115mm',
      warranty: '2 Years Replacement'
    },
    reviews: [
      { author: 'Marcus V.', rating: 5, date: '2 weeks ago', comment: 'The transition animations are so smooth, and the integration with HomeKit was instant. Highly recommend!' },
      { author: 'Sarah K.', rating: 4, date: '1 month ago', comment: 'Very bright and colors are deep. Fits perfectly in our modern brass lighting fixtures.' }
    ]
  },
  {
    id: 'power-hub-lucky',
    name: 'Lucky Smart Power Hub',
    description: 'Surge-protected smart outlet strip featuring 4 power sockets and 30W USB-C PD fast ports.',
    longDescription: 'The pinnacle of power management. Encased in a flame-retardant, anodized carbon chassis, the Lucky Smart Power Hub features 4 heavy-duty surge-protected sockets and 3 smart USB ports (including a high-speed 30W USB-C Power Delivery port). Each AC socket can be toggled independently via the cloud, allowing for complex scheduling, real-time electrical load analysis, and power consumption telemetry straight to your smartphone.',
    price: 54.00,
    rating: 4.7,
    reviewsCount: 89,
    badge: 'Premium Edition',
    category: 'Power Solutions',
    stock: 12,
    image: 'https://images.unsplash.com/photo-1558244661-d248897f7bc4?auto=format&fit=crop&w=600&q=80',
    specs: {
      voltage: '220V - 250V AC, 16A Max',
      surgeProtection: '4200 Joules rating',
      protocol: 'Wi-Fi 2.4GHz, Matter over Wi-Fi',
      outlets: '4 AC Sockets + 2 USB-A + 1 USB-C PD',
      cableLength: '2.5 Meters Heavy-Duty Cord',
      dimensions: '310mm x 65mm x 40mm',
      warranty: '3 Years Limited'
    },
    reviews: [
      { author: 'Dianne R.', rating: 5, date: '3 days ago', comment: 'Excellent build quality. The power monitoring tool has helped me identify active power hog devices in my workshop.' },
      { author: 'Alexander M.', rating: 5, date: '3 weeks ago', comment: 'Heavy duty, premium design. The matte black finish looks incredibly smart.' }
    ]
  },
  {
    id: 'tools-pro-installer',
    name: 'Pro Hardware Installer Kit',
    description: 'Ultra-durable, safety-insulated, professional-grade kit for clean wiring projects.',
    longDescription: 'Engineered specifically for certified electricians and serious DIY enthusiasts. The Pro Hardware Installer Kit is loaded with carbon-alloy steel hand tools insulated up to 1000V AC. Includes professional wire strippers with micro-adjustment dial, high-leverage heavy shears, dual-component handle screwdrivers, precision needle-nose pliers, and a premium digital contactless voltage tester housed in a premium impact-proof, dust-sealed tactical carrying case.',
    price: 79.50,
    rating: 4.9,
    reviewsCount: 64,
    badge: 'Electricians Choice',
    category: 'Tools & Gear',
    stock: 8,
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    specs: {
      insulation: 'VDE certified up to 1000V AC',
      material: 'Chrome-Vanadium-Molybdenum Steel',
      pieces: '14 Premium Tools + Rugged Hard-case',
      weight: '2.8 kg total',
      standards: 'IEC 60900 compliant',
      dimensions: '350mm x 280mm x 85mm',
      warranty: 'Lifetime Tool Warranty'
    },
    reviews: [
      { author: 'Thomas D.', rating: 5, date: '1 month ago', comment: 'I use this kit professionally every day. The insulation is extremely solid, and the wire stripper handles gauge perfectly.' },
      { author: 'Viktor H.', rating: 5, date: '2 months ago', comment: 'Premium feel, heavy-duty build. Feels safe and operates beautifully.' }
    ]
  },
  {
    id: 'switch-smart-duo',
    name: 'Tactile Smart Switch Duo',
    description: 'Whisper-quiet premium switch kit with custom haptic feedback and energy monitoring.',
    longDescription: 'Redefine how you interact with your home. The Tactile Smart Switch Duo replaces standard rocker switches with stunning, glass-panelled touch-capacitive control surfaces. Equipped with micro-haptic vibrational feedback, customizable neon status rings, and full integration with major smart home platforms. Works with or without a neutral wire (using the included smart bypass adapter) to enable instant smart dimming, schedules, and automation.',
    price: 68.00,
    rating: 4.8,
    reviewsCount: 112,
    badge: 'Innovative Tech',
    category: 'Smart Home',
    stock: 19,
    image: 'https://images.unsplash.com/photo-1615873966507-64b4ef84c01d?auto=format&fit=crop&w=600&q=80',
    specs: {
      voltage: '110V - 240V AC',
      maxLoad: '600W Resistive, 150W LED',
      protocol: 'Thread (Matter Ready), BLE',
      neutralRequired: 'Optional (Bypass included)',
      gangCount: '2-Gang Touch Capacitive',
      dimensions: '86mm x 86mm x 34mm',
      warranty: '2 Years Replacement'
    },
    reviews: [
      { author: 'Elena P.', rating: 5, date: '1 week ago', comment: 'Absolutely gorgeous touch plate. The backlight ring can be customized to match our wall paint. Pure premium.' },
      { author: 'Nathan G.', rating: 4, date: '1 month ago', comment: 'Wiring was straightforward, and responsiveness is virtually instantaneous using Apple Home over Thread.' }
    ]
  },
  {
    id: 'light-led-accent',
    name: 'Prism LED Accent Bar',
    description: 'Ultra-slim modular architectural neon lighting for ambient shelves, media centers and panels.',
    longDescription: 'Bring sleek, modern architectural accenting into any room. The Prism LED Accent Bar is a modular, solid-aluminum-housed neon strip that snaps together magnetically. Designed with advanced individually-addressable RGBIC LEDs, it generates vibrant, uniform flows of light without hot spots. Mounts seamlessly under shelves, behind televisions, or inside display cabinets with the included industrial-strength magnetic brackets.',
    price: 22.50,
    rating: 4.6,
    reviewsCount: 75,
    badge: 'Popular',
    category: 'Lighting',
    stock: 35,
    image: 'https://images.unsplash.com/photo-1565814636199-ae8133055c1c?auto=format&fit=crop&w=600&q=80',
    specs: {
      voltage: '5V DC USB-Powered (Adapter Included)',
      brightness: '450 lm per bar',
      leds: '60 High-Density RGBIC LEDs/meter',
      expandability: 'Chain up to 6 bars together',
      control: 'Local button, BLE app, Wi-Fi',
      length: '400mm per bar',
      warranty: '1 Year'
    },
    reviews: [
      { author: 'Jessica L.', rating: 5, date: '5 days ago', comment: 'The magnetic linking is genius. Put three under my office floating shelves and it looks incredibly clean!' },
      { author: 'David T.', rating: 4, date: '1 month ago', comment: 'Very bright and rich color blends. Connecting to the app took me two tries, but works flawlessly since.' }
    ]
  },
  {
    id: 'socket-secure-set',
    name: 'Secure-Lock Wall Socket Set',
    description: 'Heavy-duty wall socket array with integrated surge protection and intelligent child safety locks.',
    longDescription: 'Built with rugged durability and supreme safety in mind. The Secure-Lock Wall Socket Set provides double-gang luxury sockets finished in brushed gunmetal steel. Engineered with internal mechanical shutters that prevent foreign object insertion, automatic surge isolation, and built-in USB ports (1x USB-C 20W PD, 1x USB-A 18W) to fast-charge your electronics directly without bulky brick adapters.',
    price: 45.00,
    rating: 4.7,
    reviewsCount: 52,
    badge: 'Essential',
    category: 'Power Solutions',
    stock: 15,
    image: 'https://images.unsplash.com/photo-1558244402-286dd748c593?auto=format&fit=crop&w=600&q=80',
    specs: {
      voltage: '110V - 250V AC, 15A',
      finish: 'Brushed Gunmetal Premium Steel',
      ports: '2x Sockets + 1x USB-C PD + 1x USB-A QC',
      protection: '1800 Joules Surge & Thermal Cutoff',
      certification: 'UL, CE Listed',
      dimensions: '120mm x 75mm x 25mm',
      warranty: '5 Years Heavy-Duty Guarantee'
    },
    reviews: [
      { author: 'Robert C.', rating: 5, date: '2 months ago', comment: 'Replaced all our kitchen outlets with these. The brushed finish is beautiful and the USB-C charges our iPads rapidly.' },
      { author: 'Siddharth R.', rating: 4, date: '3 months ago', comment: 'Robust terminals, excellent click feel when plugging in cords. Solid item.' }
    ]
  },
  {
    id: 'light-hanging-spot',
    name: 'Centauri Architectural Spot',
    description: 'Premium brushed brass spotlight fixture with modular optical beam angle adjusters.',
    longDescription: 'Make a design statement with high-precision focal lighting. The Centauri Spot is a masterfully milled aluminum spotlight plated in elegant brushed brass. Specifically suited for modern minimal residences and gallery applications. Features exchangeable modular glass lenses (15°, 24°, and 36° options included) to shape the light beam precisely, paired with a fully articulating multi-axis joint for dynamic ceiling or wall orientation.',
    price: 89.00,
    rating: 4.8,
    reviewsCount: 38,
    badge: 'Designer Special',
    category: 'Lighting',
    stock: 6,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80',
    specs: {
      voltage: '110V - 240V AC',
      socket: 'GU10 (Modular LED Bulb Included)',
      material: 'CNC Milled Aluminum & Genuine Brass',
      angles: '15° / 24° / 36° interchangeable lenses',
      adjustability: '360° pan, 180° tilt',
      dimensions: '140mm height x 60mm diameter',
      warranty: '3 Years Full Structural'
    },
    reviews: [
      { author: 'Vivian O.', rating: 5, date: '3 weeks ago', comment: 'Stunning minimalist design. The warm focus light highlights our painting beautifully. Buying 3 more.' },
      { author: 'Liam W.', rating: 5, date: '1 month ago', comment: 'Excellent brass texture, substantial weight and high-quality build. Outstanding.' }
    ]
  },
  {
    id: 'eco-solar-charger',
    name: 'Helios Eco Solar Panel',
    description: 'High-efficiency monocrystalline solar charging panel with smart power regulators.',
    longDescription: 'Harness the power of clean solar energy with the Helios Eco Solar Panel. Crafted using next-generation high-conductivity monocrystalline silicon cells, it achieves an industry-leading 24.2% solar conversion efficiency. Featuring a ultra-tough weatherproof ETFE laminate casing, built-in smart voltage regulators to prevent device overcharging, and dual ports (USB-C & DC) to feed power directly into phones, power-banks, or emergency battery backup systems.',
    price: 110.00,
    rating: 4.9,
    reviewsCount: 46,
    badge: 'Eco Friendly',
    category: 'Eco Energy',
    stock: 5,
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=600&q=80',
    specs: {
      wattage: '40W Peak Output',
      efficiency: '24.2% Monocrystalline',
      ports: '1x USB-C (18W), 1x DC 5521 (18V)',
      weatherproof: 'IP67 dust & water resistant',
      weight: '1.4 kg (Foldable design)',
      dimensions: '420mm x 350mm x 15mm (folded)',
      warranty: '5 Years Performance Warranty'
    },
    reviews: [
      { author: 'Clara S.', rating: 5, date: '1 week ago', comment: 'Unbelievably good solar panel. I took it on a 4-day hiking trip and it charged my phone and power bank with ease in standard sunlight.' },
      { author: 'Ethan B.', rating: 4, date: '2 weeks ago', comment: 'Solid kickstand design, captures angles easily. Build is incredibly rugged.' }
    ]
  },
  {
    id: 'smart-thermostat-nexus',
    name: 'Nexus Smart Thermostat',
    description: 'Elegant dial thermostat with crystal LED glass, geofencing, and learning AI algorithm.',
    longDescription: 'Take total control of your environment with the Nexus Smart Thermostat. Housed in a beautifully circular brushed aluminum dial with a pristine black glass touchscreen. Utilizing learning-behavior algorithms, it learns your heating and cooling habits within 7 days, optimizing power usage to cut your energy bills up to 26%. Works seamlessly with Alexa, Google Home, and Apple Home, offering geofenced auto-away features that regulate temperatures when you leave.',
    price: 145.00,
    rating: 4.9,
    reviewsCount: 97,
    badge: 'Top Choice',
    category: 'Smart Home',
    stock: 10,
    image: 'https://images.unsplash.com/photo-1595853035070-59a39fe84de3?auto=format&fit=crop&w=600&q=80',
    specs: {
      compatibility: 'Works with 95% of 24V HVAC systems',
      display: '2.5 inch Premium LCD Glass Display',
      protocol: 'Wi-Fi 802.11 b/g/n, Zigbee 3.0',
      sensors: 'Temperature, Humidity, Motion, Ambient Light',
      cwire: 'Recommended (Power adapter included)',
      dimensions: '84mm diameter x 28mm depth',
      warranty: '3 Years Full Replacement'
    },
    reviews: [
      { author: 'Gregory N.', rating: 5, date: '1 month ago', comment: 'This dial is pure art. Turning it is highly tactile and smooth, and our electric bills are already showing a drop!' },
      { author: 'Clara F.', rating: 5, date: '2 months ago', comment: 'Easy to install, the step-by-step instructions on the phone app were perfect. The display is gorgeous.' }
    ]
  }
];

export const categories = ['All', 'Lighting', 'Power Solutions', 'Smart Home', 'Eco Energy', 'Tools & Gear'];
