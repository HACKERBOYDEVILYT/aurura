import { MediaItem, LiveTVChannel, SportsEvent, YouTubeShort, YouTubeMusicTrack } from '../types';

// High-speed verified video stream sources for the Media3 player engine
const STREAM_SAMPLE_1 = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
const STREAM_SAMPLE_2 = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4';
const STREAM_SAMPLE_3 = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4';
const STREAM_SAMPLE_4 = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
const STREAM_SAMPLE_5 = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4';
const STREAM_SPORTS_SAMPLE = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4';
const STREAM_HLS_SAMPLE = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';

export const MEDIA_CATALOG: MediaItem[] = [
  // --- BANGLA NATOK & TELEFILMS ---
  {
    id: 'bn-natok-1',
    type: 'natok',
    title: 'বুকের বাঁ পাশে',
    titleEn: 'Buker Ba Pashe',
    tagline: 'ভালোবাসার নিঃশব্দ ব্যথা আর আত্মত্যাগের অনন্য গল্প',
    taglineEn: 'A silent story of love, heartbreak, and sacrifice',
    description: 'রাহুল ও জয়ার মিষ্টি প্রেমের গল্প হঠাৎ এক ঝড়ের মুখোমুখি হয়। হৃদয়স্পর্শী গল্প আর আফরান নিশো ও মেহজাবীন চৌধুরীর কালজয়ী অভিনয় যা দর্শকদের চোখে জল এনে দেবে।',
    descriptionEn: 'The tender romance between Rahul and Jaya faces an abrupt life storm. A timeless emotional masterpiece starring Afran Nisho and Mehazabien Chowdhury.',
    poster: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?q=80&w=700&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1600&auto=format&fit=crop',
    rating: 9.3,
    year: 2024,
    duration: '48 min',
    ageRating: '13+',
    genre: ['রোমান্টিক', 'নাটক', 'আবেগঘন'],
    genreEn: ['Romance', 'Drama', 'Emotional'],
    director: 'মিজানুর রহমান আরিয়ান (Mizanur Rahman Aryan)',
    starCategory: 'Afran Nisho',
    cast: [
      { name: 'আফরান নিশো', nameEn: 'Afran Nisho', role: 'রাহুল', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop' },
      { name: 'মেহজাবীন চৌধুরী', nameEn: 'Mehazabien Chowdhury', role: 'জয়া', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop' }
    ],
    streamUrl: STREAM_SAMPLE_1,
    fallbackStreamUrl: STREAM_SAMPLE_2,
    isTrending: true,
    isPopular: true,
    isFeatured: true,
    isBanglaHub: true
  },
  {
    id: 'bn-natok-2',
    type: 'natok',
    title: 'বিকেল বেলার পাখি',
    titleEn: 'Bikel Belar Pakhi',
    tagline: 'এক মধ্যবিত্ত বাবার নিঃস্বার্থ লড়াই ও পারিবারিক বন্ধন',
    taglineEn: 'The selfless struggle of a middle-class father',
    description: 'ফজলুর রহমান বাবু অভিনীত এই নাটকে উঠে এসেছে এক মধ্যবিত্ত পরিবারের কঠিন বাস্তবতা, সন্তানদের মুখে হাসি ফোটানোর জন্য একজন পিতার নীরব ত্যাগ।',
    descriptionEn: 'Starring Fazlur Rahman Babu, this drama portrays the harsh realities of a middle-class family and a father\'s quiet sacrifices.',
    poster: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=700&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop',
    rating: 9.1,
    year: 2023,
    duration: '54 min',
    ageRating: 'All',
    genre: ['পারিবারিক', 'নাটক', 'ইমোশনাল'],
    genreEn: ['Family', 'Drama', 'Emotional'],
    director: 'ইমরাউল রাফাত (Imraul Rafat)',
    starCategory: 'Fazlur Rahman Babu',
    cast: [
      { name: 'ফজলুর রহমান বাবু', nameEn: 'Fazlur Rahman Babu', role: 'বাবা', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop' }
    ],
    streamUrl: STREAM_SAMPLE_2,
    fallbackStreamUrl: STREAM_SAMPLE_1,
    isTrending: true,
    isPopular: true,
    isBanglaHub: true
  },
  {
    id: 'bn-natok-3',
    type: 'telefilm',
    title: 'নেটওয়ার্কের বাইরে',
    titleEn: 'Networker Baire',
    tagline: 'বন্ধুত্ব, সমুদ্রযাত্রা এবং জীবনের অপ্রত্যাশিত এক মোড়',
    taglineEn: 'Friendship, road trip, and an unexpected turn of fate',
    description: 'চার বন্ধুর সমুদ্র সৈকতে রোড ট্রিপের আনন্দ মুহূর্তেই একটি বিপজ্জনক দুর্ঘটনায় রূপ নেয়। বন্ধুত্ব ও জীবনের সবচেয়ে সংবেদনশীল পরীক্ষা।',
    descriptionEn: 'Four close friends go on a road trip to the coast, only for joyful adventure to turn into an emotionally charged test of bonds.',
    poster: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=700&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1600&auto=format&fit=crop',
    rating: 8.9,
    year: 2023,
    duration: '1h 35m',
    ageRating: '13+',
    genre: ['বন্ধুত্ব', 'রোমাঞ্চ', 'নাটক'],
    genreEn: ['Friendship', 'Adventure', 'Drama'],
    director: 'মিজানুর রহমান আরিয়ান (Mizanur Rahman Aryan)',
    starCategory: 'Yash Rohan',
    cast: [
      { name: 'ইয়াশ রোহান', nameEn: 'Yash Rohan', role: 'মুনীম', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop' },
      { name: 'তাসনিয়া ফারিণ', nameEn: 'Tasnia Farin', role: 'কথা', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop' }
    ],
    streamUrl: STREAM_SAMPLE_3,
    fallbackStreamUrl: STREAM_SAMPLE_4,
    isTrending: true,
    isBanglaHub: true
  },
  {
    id: 'bn-natok-4',
    type: 'natok',
    title: 'পুনর্জন্ম (Punorjonmo)',
    titleEn: 'Punorjonmo',
    tagline: 'রহস্য, সাইকোলজিক্যাল থ্রিলার এবং অন্ধকার রান্নাবাড়ির গল্প',
    taglineEn: 'A dark psychological thriller of secrets and deadly obsession',
    description: 'রাফসান হকের রান্নার নেশা আর তার স্ত্রীর রহস্যজনক নিখোঁজের পেছনের শিহরণ জাগানো সাইকো-থ্রিলার। ভিকি জাহেদের এক অতুলনীয় পরিচালনা।',
    descriptionEn: 'Chef Rafsan Haq\'s dark culinary passion intertwines with his wife\'s baffling disappearance in Vicky Zahed\'s iconic psychological thriller.',
    poster: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=700&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop',
    rating: 9.4,
    year: 2024,
    duration: '52 min',
    ageRating: '16+',
    genre: ['থ্রিলার', 'রহস্য', 'সাইকোলজিক্যাল'],
    genreEn: ['Thriller', 'Mystery', 'Psychological'],
    director: 'ভিকি জাহেদ (Vicky Zahed)',
    starCategory: 'Afran Nisho',
    cast: [
      { name: 'আফরান নিশো', nameEn: 'Afran Nisho', role: 'রাফসান হক', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop' },
      { name: 'মেহজাবীন চৌধুরী', nameEn: 'Mehazabien Chowdhury', role: 'রোকেয়া', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop' }
    ],
    streamUrl: STREAM_SAMPLE_4,
    fallbackStreamUrl: STREAM_SAMPLE_1,
    isPopular: true,
    isBanglaHub: true
  },

  // --- BANGLA MOVIES ---
  {
    id: 'bn-movie-1',
    type: 'movie',
    title: 'হাওয়া (Hawa)',
    titleEn: 'Hawa',
    tagline: 'গভীর সমুদ্রের ট্রলারে এক রহস্যময়ী নারীর আগমন',
    taglineEn: 'Deep sea fishermen catch something that wasn\'t meant to be caught',
    description: 'বঙ্গোপসাগরে ভেসে বেড়ানো এক মাছ ধরার ট্রলারে জেলেদের জালে ধরা পড়ে এক রহস্যময়ী রূপবতী নারী। এরপরই ট্রলারের ভেতরে শুরু হয় অতিপ্রাকৃতিক ও মনস্তাত্ত্বিক বিশৃঙ্খলা। চঞ্চল চৌধুরীর অবিস্মরণীয় চান্দু মাঝি চরিত্র।',
    descriptionEn: 'A fishing trawler in the deep Bay of Bengal catches an enigmatic mute girl in their nets. Soon suspicion, ancient mythology, and psychological terror unravel among the crew.',
    poster: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=700&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?q=80&w=1600&auto=format&fit=crop',
    rating: 8.8,
    year: 2023,
    duration: '2h 11m',
    ageRating: '16+',
    genre: ['রহস্য', 'থ্রিলার', 'ড্রামা'],
    genreEn: ['Mystery', 'Thriller', 'Drama'],
    director: 'মেজবাউর রহমান সুমন (Mejbaur Rahman Sumon)',
    starCategory: 'Chanchal Chowdhury',
    cast: [
      { name: 'চঞ্চল চৌধুরী', nameEn: 'Chanchal Chowdhury', role: 'চান্দু মাঝি', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop' },
      { name: 'নাজিফা তুষি', nameEn: 'Nazifa Tushi', role: 'গুলতি', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop' }
    ],
    streamUrl: STREAM_SAMPLE_1,
    fallbackStreamUrl: STREAM_SAMPLE_3,
    isTrending: true,
    isPopular: true,
    isFeatured: true,
    isBanglaHub: true
  },
  {
    id: 'bn-movie-2',
    type: 'movie',
    title: 'পরাণ (Poran)',
    titleEn: 'Poran',
    tagline: 'সত্য ঘটনা অবলম্বনে তৈরি ভালোবাসা, ঘৃণা ও অপরাধের উপাখ্যান',
    taglineEn: 'Based on true events: A tragic tale of toxic obsession and retribution',
    description: 'রোমান ও অনন্যার প্রেমের তীব্রতা কীভাবে একটি শান্ত মফস্বল শহরকে রক্তক্ষয়ী ট্র্যাজেডিতে পরিণত করে। শরীফুল রাজ ও বিদ্যা সিনহা মিমের আলোড়ন তোলা অভিনয়।',
    descriptionEn: 'The intense, obsessive romance between Roman and Ananya spirals into fatal small-town violence and tragedy. A massive box office sensation.',
    poster: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=700&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1600&auto=format&fit=crop',
    rating: 8.5,
    year: 2022,
    duration: '2h 19m',
    ageRating: '16+',
    genre: ['রোমান্টিক ক্রাইম', 'ড্রামা', 'ট্র্যাজেডি'],
    genreEn: ['Romantic Crime', 'Drama', 'Tragedy'],
    director: 'রায়হান রাফী (Raihan Rafi)',
    starCategory: 'Shoriful Razz',
    cast: [
      { name: 'শরীফুল রাজ', nameEn: 'Shoriful Razz', role: 'রোমান', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop' },
      { name: 'বিদ্যা সিনহা মিম', nameEn: 'Bidya Sinha Mim', role: 'অনন্যা', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop' }
    ],
    streamUrl: STREAM_SAMPLE_2,
    fallbackStreamUrl: STREAM_SAMPLE_5,
    isPopular: true,
    isBanglaHub: true
  },
  {
    id: 'bn-movie-3',
    type: 'movie',
    title: 'প্রিয়তমা (Priyotoma)',
    titleEn: 'Priyotoma',
    tagline: 'জীবনের শেষ দিন পর্যন্ত শুধুই তোমার জন্য অপেক্ষা',
    taglineEn: 'Waiting till the very last breath of existence',
    description: 'শাকিব খানের ব্লকবাস্টার রোমান্টিক অ্যাকশন ট্র্যাজেডি। এক বৃদ্ধ প্রেমিকের স্মৃতি রোমন্থন ও তার অবিস্মরণীয় প্রেমকাহিনি যা হৃদয় ছুঁয়ে যায়।',
    descriptionEn: 'The mega blockbuster starring Shakib Khan. An aged man reflects on the incandescent love that shaped his soul and shattered his world.',
    poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=700&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1600&auto=format&fit=crop',
    rating: 8.6,
    year: 2023,
    duration: '2h 28m',
    ageRating: '13+',
    genre: ['অ্যাকশন', 'রোমান্টিক', 'ড্রামা'],
    genreEn: ['Action', 'Romance', 'Drama'],
    director: 'হিমেল আশরাফ (Hemel Ashraf)',
    starCategory: 'Shakib Khan',
    cast: [
      { name: 'শাকিব খান', nameEn: 'Shakib Khan', role: 'সুমন', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop' },
      { name: 'ইধিকা পাল', nameEn: 'Idhika Paul', role: 'ইতি', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop' }
    ],
    streamUrl: STREAM_SAMPLE_3,
    fallbackStreamUrl: STREAM_SAMPLE_1,
    isPopular: true,
    isBanglaHub: true
  },
  {
    id: 'bn-movie-4',
    type: 'movie',
    title: 'আয়নাবাজি (Aynabaji)',
    titleEn: 'Aynabaji',
    tagline: 'ঢাকা শহরের আয়নায় অন্য মানুষের হয়ে বাঁচার খেলা',
    taglineEn: 'The art of living other people\'s lives in the mirror of Dhaka',
    description: 'শরাফত করিম আয়না এক অসাধারণ ছদ্মবেশী অভিনেতা, যে অন্যের সাজা ভোগ করার জন্য জেলে যায়। চঞ্চল চৌধুরীর বহু রূপের জাদুকরী অভিনয়।',
    descriptionEn: 'Aynabaji follows Ayna, an actor who mimics wealthy convicts and serves their prison sentences, until a dangerous political intrigue entangles him.',
    poster: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=700&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop',
    rating: 9.0,
    year: 2020,
    duration: '2h 15m',
    ageRating: '16+',
    genre: ['ক্রাইম', 'ড্রামা', 'থ্রিলার'],
    genreEn: ['Crime', 'Drama', 'Thriller'],
    director: 'অমিতাভ রেজা চৌধুরী (Amitabh Reza)',
    starCategory: 'Chanchal Chowdhury',
    cast: [
      { name: 'চঞ্চল চৌধুরী', nameEn: 'Chanchal Chowdhury', role: 'আয়না / নিজাম', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop' }
    ],
    streamUrl: STREAM_SAMPLE_4,
    fallbackStreamUrl: STREAM_SAMPLE_2,
    isBanglaHub: true
  },

  // --- TV SERIES (BANGLA & GLOBAL) ---
  {
    id: 'bn-series-1',
    type: 'series',
    title: 'কারাগার (Karagar)',
    titleEn: 'Karagar',
    tagline: '৫০ বছর ধরে বন্ধ থাকা সেলে হঠাৎ হাজির এক অজ্ঞাত বন্দি',
    taglineEn: 'A mysterious man appears in cell 145, shut for 50 years',
    description: 'আকাশনগর সেন্ট্রাল জেলের ১৪৫ নম্বর সেলে কীভাবে উদয় হলো এমন একজন লোক, যে নিজেকে দাবি করে ২৫০ বছর বয়সী মীর জাফর হত্যাকারী? সৈয়দ আহমেদ শওকীর মাস্টারপিস সিরিজ।',
    descriptionEn: 'In Akashnagar Central Jail\'s forgotten Cell 145, a mute inmate mysteriously appears, claiming through sign language that he has lived for 250 years.',
    poster: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=700&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=1600&auto=format&fit=crop',
    rating: 9.2,
    year: 2023,
    duration: '2 Seasons',
    ageRating: '16+',
    genre: ['রহস্য', 'থ্রিলার', 'ড্রামা'],
    genreEn: ['Mystery', 'Thriller', 'Drama'],
    director: 'সৈয়দ আহমেদ শওকী (Syed Ahmed Shawki)',
    starCategory: 'Chanchal Chowdhury',
    cast: [
      { name: 'চঞ্চল চৌধুরী', nameEn: 'Chanchal Chowdhury', role: 'রহস্যময় বন্দি', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop' },
      { name: 'ইন্তেখাব দিনার', nameEn: 'Intekhab Dinar', role: 'জেল সুপার', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop' }
    ],
    streamUrl: STREAM_SAMPLE_1,
    isTrending: true,
    isPopular: true,
    isBanglaHub: true,
    seasons: [
      {
        seasonNumber: 1,
        title: 'সিজন ১: অজ্ঞাত বন্দি',
        titleEn: 'Season 1: The Nameless Inmate',
        episodes: [
          {
            id: 'kg-s1-e1',
            seasonNumber: 1,
            episodeNumber: 1,
            title: 'পর্ব ১: সেল নম্বর ১৪৫',
            titleEn: 'Episode 1: Cell 145',
            duration: '42 min',
            thumbnail: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=500&auto=format&fit=crop',
            description: '৫০ বছর ধরে বন্ধ থাকা সেলে এক সকালের আলোয় আবিষ্কৃত হয় এক নিঃশব্দ মানুষ।',
            descriptionEn: 'The prison warden is stunned when an unidentified mute man is found locked in an abandoned dungeon cell.',
            streamUrl: STREAM_SAMPLE_1
          },
          {
            id: 'kg-s1-e2',
            seasonNumber: 1,
            episodeNumber: 2,
            title: 'পর্ব ২: ইতিহাসের ছায়া',
            titleEn: 'Episode 2: Shadows of History',
            duration: '45 min',
            thumbnail: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=500&auto=format&fit=crop',
            description: 'চিহ্ন ভাষার মাধ্যমে বন্দি এমন কিছু তথ্য প্রকাশ করে যা কেবল ইতিহাসের পাতায় পাওয়া সম্ভব।',
            descriptionEn: 'A sign language interpreter begins to decode chilling historical assertions from the prisoner.',
            streamUrl: STREAM_SAMPLE_2
          },
          {
            id: 'kg-s1-e3',
            seasonNumber: 1,
            episodeNumber: 3,
            title: 'পর্ব ৩: পলাতক সত্য',
            titleEn: 'Episode 3: The Vanishing Truth',
            duration: '48 min',
            thumbnail: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=500&auto=format&fit=crop',
            description: 'বাইরের জগতে এক খুনের সূত্র মিলে যায় জেলের ভেতরে থাকা লোকটির বয়ানের সাথে।',
            descriptionEn: 'Police investigators on the outside connect an ongoing homicide to the statements inside the jail.',
            streamUrl: STREAM_SAMPLE_3
          }
        ]
      }
    ]
  },
  {
    id: 'bn-series-2',
    type: 'series',
    title: 'মহানগর (Mohanagar)',
    titleEn: 'Mohanagar',
    tagline: 'এক রাতের থানায় ক্ষমতা, অর্থ আর ন্যায়ের অগ্নিপরীক্ষা',
    taglineEn: 'One single night at a police station testing morals, power, and justice',
    description: 'ওসি হারুন চরিত্রে মোশাররফ করিমের রক্ত গরম করা সংলাপ ও অভিনয়। ঢাকার এক শীতের রাতে এক ভিআইপি পুত্রের গাড়ি দুর্ঘটনাকে কেন্দ্র করে তৈরি হওয়া রাজনৈতিক কূটকৌশল।',
    descriptionEn: 'A gripping nocturnal police thriller set over six tense hours inside a Dhaka police station. OC Harun (Mosharraf Karim) navigates corrupt oligarchs and systemic pressure.',
    poster: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?q=80&w=700&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=1600&auto=format&fit=crop',
    rating: 9.3,
    year: 2023,
    duration: '2 Seasons',
    ageRating: '16+',
    genre: ['ক্রাইম', 'ড্রামা', 'পলিটিক্যাল থ্রিলার'],
    genreEn: ['Crime', 'Drama', 'Political Thriller'],
    director: 'আশফাক নিপুণ (Ashfaque Nipun)',
    starCategory: 'Mosharraf Karim',
    cast: [
      { name: 'মোশাররফ করিম', nameEn: 'Mosharraf Karim', role: 'ওসি হারুন অর রশীদ', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop' },
      { name: 'শ্যামল মাওলা', nameEn: 'Shamol Mawla', role: 'আফনান চৌধুরী', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop' }
    ],
    streamUrl: STREAM_SAMPLE_4,
    isPopular: true,
    isTrending: true,
    isBanglaHub: true,
    seasons: [
      {
        seasonNumber: 1,
        title: 'সিজন ১: মধ্যরাতের খেলা',
        titleEn: 'Season 1: Midnight Game',
        episodes: [
          {
            id: 'mh-s1-e1',
            seasonNumber: 1,
            episodeNumber: 1,
            title: 'পর্ব ১: দুর্ঘটনা নাকি ফাঁদ?',
            titleEn: 'Episode 1: Accident or Trap?',
            duration: '38 min',
            thumbnail: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?q=80&w=500&auto=format&fit=crop',
            description: 'মধ্যরাতে কোতোয়ালি থানায় নিয়ে আসা হয় প্রভাবশালী এক নেতার বেপরোয়া ছেলেকে।',
            descriptionEn: 'The son of a high-profile politician is hauled into Kotwali police station after a hit-and-run.',
            streamUrl: STREAM_SAMPLE_4
          },
          {
            id: 'mh-s1-e2',
            seasonNumber: 1,
            episodeNumber: 2,
            title: 'পর্ব ২: ওসি হারুনের চা',
            titleEn: 'Episode 2: OC Harun\'s Tea',
            duration: '41 min',
            thumbnail: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=500&auto=format&fit=crop',
            description: 'চা খাওয়ার ছলে ওসি হারুন শুরু করেন তার জটিল দাবা খেলা।',
            descriptionEn: 'Over endless cups of spiced tea, OC Harun begins playing mind games with the suspects and his superiors.',
            streamUrl: STREAM_SAMPLE_5
          }
        ]
      }
    ]
  },
  {
    id: 'series-1',
    type: 'series',
    title: 'স্ট্রেঞ্জার থিংস (Stranger Things)',
    titleEn: 'Stranger Things',
    tagline: 'হকিন্সের ভূগর্ভস্থ উল্টোজগৎ আর অলৌকিক শক্তি',
    taglineEn: 'When a young boy vanishes, a small town uncovers a mystery of secret experiments and terrifying supernatural forces',
    description: 'আশির দশকের ছোট্ট শহর হকিন্সে এক কিশোরের নিখোঁজ হওয়া এবং সুপারপাওয়ার সম্পন্ন এক রহস্যময়ী মেয়ের আগমন।',
    descriptionEn: 'A love letter to the \'80s classics that captivated a generation, set in Hawkins, Indiana.',
    poster: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=700&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop',
    rating: 8.7,
    year: 2024,
    duration: '4 Seasons',
    ageRating: '16+',
    genre: ['সাই-ফাই', 'হরর', 'অ্যাডভেঞ্চার'],
    genreEn: ['Sci-Fi', 'Horror', 'Adventure'],
    director: 'ডারফার ব্রাদার্স (The Duffer Brothers)',
    streamUrl: STREAM_SAMPLE_3,
    isPopular: true
  },

  // --- GLOBAL MOVIES ---
  {
    id: 'movie-1',
    type: 'movie',
    title: 'ইন্টারস্টেলার (Interstellar)',
    titleEn: 'Interstellar',
    tagline: 'মানবতার শেষ আশা মহাবিশ্বের দূরতম কৃষ্ণগহ্বরের ওপারে',
    taglineEn: 'Mankind was born on Earth. It was never meant to die here.',
    description: 'পৃথিবীর অস্তিত্ব যখন ধ্বংসের মুখে, তখন মানবজাতির নতুন আবাস খুঁজতে একদল মহাকাশচারী পাড়ি জমান ওয়ার্মহোল পেরিয়ে গভীর মহাবিশ্বে। ক্রিস্টোফার নোলানের কালজয়ী সাইন্স ফিকশন।',
    descriptionEn: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft along with a team of researchers to find a new planet for humans.',
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=700&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop',
    rating: 8.9,
    year: 2023,
    duration: '2h 49m',
    ageRating: 'PG-13',
    genre: ['সাই-ফাই', 'অ্যাডভেঞ্চার', 'ড্রামা'],
    genreEn: ['Sci-Fi', 'Adventure', 'Drama'],
    director: 'ক্রিস্টোফার নোলান (Christopher Nolan)',
    streamUrl: STREAM_SAMPLE_1,
    fallbackStreamUrl: STREAM_SAMPLE_2,
    isPopular: true,
    isFeatured: true
  },
  {
    id: 'movie-2',
    type: 'movie',
    title: 'ইনসেপশন (Inception)',
    titleEn: 'Inception',
    tagline: 'স্বপ্নের ভেতরে স্বপ্ন— মনের ভেতর চিন্তা রোপণের খেলা',
    taglineEn: 'Your mind is the scene of the crime.',
    description: 'ডম কব একজন দক্ষ চোর, যে মানুষের অবচেতন মনের স্বপ্ন থেকে গোপন তথ্য চুরি করে। তাকে দেওয়া হয় এক অসম্ভব কাজ— এবার তথ্য চুরি নয়, মনে নতুন চিন্তা বুনে দিতে হবে।',
    descriptionEn: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=700&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1600&auto=format&fit=crop',
    rating: 8.8,
    year: 2022,
    duration: '2h 28m',
    ageRating: 'PG-13',
    genre: ['অ্যাকশন', 'সাই-ফাই', 'থ্রিলার'],
    genreEn: ['Action', 'Sci-Fi', 'Thriller'],
    director: 'ক্রিস্টোফার নোলান (Christopher Nolan)',
    streamUrl: STREAM_SAMPLE_2,
    isTrending: true
  },
  {
    id: 'movie-3',
    type: 'movie',
    title: 'ডুন: পার্ট টু (Dune: Part Two)',
    titleEn: 'Dune: Part Two',
    tagline: 'অ্যারাকিসের বালুময় মরুতে শুরু মহাকাব্যিক প্রতিশোধ ও মুক্তির লড়াই',
    taglineEn: 'Long live the fighters.',
    description: 'পল অ্যাট্রাইডিস ফ্রেমেদের সাথে একত্রিত হয়ে তার পরিবারের ধ্বংসকারীদের বিরুদ্ধে প্রতিশোধের শপথ নেয়। এক চোখ ধাঁধানো সিনেমাটিক অভিজ্ঞতা।',
    descriptionEn: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
    poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=700&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1600&auto=format&fit=crop',
    rating: 8.6,
    year: 2024,
    duration: '2h 46m',
    ageRating: 'PG-13',
    genre: ['অ্যাকশন', 'অ্যাডভেঞ্চার', 'সাই-ফাই'],
    genreEn: ['Action', 'Adventure', 'Sci-Fi'],
    director: 'ডেনিস ভিলেনোভ (Denis Villeneuve)',
    streamUrl: STREAM_SAMPLE_3,
    isFeatured: true
  }
];

// --- LIVE TELEVISION WITH FULL EPG (Electronic Program Guide) ---
export const LIVE_CHANNELS: LiveTVChannel[] = [
  {
    id: 'ch-tsports',
    name: 'টি স্পোর্টস (T Sports HD)',
    nameEn: 'T Sports HD',
    logo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=200&auto=format&fit=crop',
    category: 'Sports',
    streamUrl: STREAM_SPORTS_SAMPLE,
    currentShow: 'বিপিএল ২০২৬ লাইভ: রংপুর বনাম কুমিল্লা',
    currentShowEn: 'BPL 2026 Live: Rangpur vs Comilla',
    nextShow: 'স্পোর্টস হাইলাইটস ও ম্যাচ প্রিভিউ',
    nextShowEn: 'Sports Highlights & Post-Match Review',
    isHd: true,
    epg: [
      { id: 'epg-ts-1', time: '০৫:০০ PM', title: 'ম্যাচ প্রি-শো ও পিচ রিপোর্ট', titleEn: 'Match Pre-Show & Pitch Report', category: 'Sports Analysis', duration: '30m' },
      { id: 'epg-ts-2', time: '০৫:৩০ PM', title: 'বিপিএল ২০২৬ লাইভ: রংপুর বনাম কুমিল্লা', titleEn: 'BPL 2026 Live: Rangpur vs Comilla', category: 'Cricket Live', isCurrent: true, duration: '3h 30m' },
      { id: 'epg-ts-3', time: '০৯:০০ PM', title: 'স্পোর্টস বুলেটিন ও পোস্ট ম্যাচ শো', titleEn: 'Sports Bulletin & Post Match Show', category: 'Sports News', duration: '45m' },
      { id: 'epg-ts-4', time: '০৯:৪৫ PM', title: 'ইংলিশ প্রিমিয়ার লিগ হাইলাইটস', titleEn: 'English Premier League Highlights', category: 'Football', duration: '1h 15m' }
    ]
  },
  {
    id: 'ch-somoy',
    name: 'সময় টিভি (Somoy News HD)',
    nameEn: 'Somoy News HD',
    logo: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=200&auto=format&fit=crop',
    category: 'News',
    streamUrl: STREAM_SAMPLE_5,
    currentShow: 'সময় সংবাদ: জাতীয় ও আন্তর্জাতিক শীর্ষ সংবাদ',
    currentShowEn: 'Somoy News: Top National & World Headlines',
    nextShow: 'সম্পাদকীয় ও রাতের টকশো',
    nextShowEn: 'Editorial & Prime Time Talk Show',
    isHd: true,
    epg: [
      { id: 'epg-sm-1', time: '০৫:০০ PM', title: 'দেশের সংবাদ', titleEn: 'National News', category: 'News', duration: '60m' },
      { id: 'epg-sm-2', time: '০৬:০০ PM', title: 'সময় সংবাদ (Prime Live)', titleEn: 'Somoy News Prime', category: 'News Live', isCurrent: true, duration: '60m' },
      { id: 'epg-sm-3', time: '০৭:০০ PM', title: 'বিজনেস ইনসাইটস', titleEn: 'Business Insights', category: 'Finance', duration: '30m' },
      { id: 'epg-sm-4', time: '০৭:৩০ PM', title: 'সম্পাদকীয় আলোচনা', titleEn: 'Prime Time Editorial', category: 'Current Affairs', duration: '60m' }
    ]
  },
  {
    id: 'ch-channel-i',
    name: 'চ্যানেল আই (Channel i HD)',
    nameEn: 'Channel i HD',
    logo: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?q=80&w=200&auto=format&fit=crop',
    category: 'Bangla',
    streamUrl: STREAM_SAMPLE_2,
    currentShow: 'বিশেষ বাংলা টেলিফিল্ম ও সংগীত সন্ধ্যা',
    currentShowEn: 'Special Bangla Telefilm & Musical Night',
    nextShow: 'হৃদয়ে মাটি ও মানুষ',
    nextShowEn: 'Hridoye Mati O Manush',
    isHd: true,
    epg: [
      { id: 'epg-ci-1', time: '০৫:০০ PM', title: 'গান দিয়ে শুরু', titleEn: 'Musical Sunrise', category: 'Music', duration: '60m' },
      { id: 'epg-ci-2', time: '০৬:০০ PM', title: 'বিশেষ বাংলা টেলিফিল্ম', titleEn: 'Special Bangla Telefilm', category: 'Drama', isCurrent: true, duration: '90m' },
      { id: 'epg-ci-3', time: '০৭:৩০ PM', title: 'হৃদয়ে মাটি ও মানুষ', titleEn: 'Hridoye Mati O Manush', category: 'Agriculture/Documentary', duration: '45m' },
      { id: 'epg-ci-4', time: '০৮:১৫ PM', title: 'সংবাদ সন্ধ্যা', titleEn: 'Evening News', category: 'News', duration: '45m' }
    ]
  },
  {
    id: 'ch-jamuna',
    name: 'যমুনা টিভি (Jamuna TV)',
    nameEn: 'Jamuna TV Live',
    logo: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=200&auto=format&fit=crop',
    category: 'News',
    streamUrl: STREAM_SAMPLE_4,
    currentShow: 'ইনভেস্টিগেটিভ ৩৬০ ডিগ্রি',
    currentShowEn: 'Investigative 360 Degrees',
    nextShow: 'রাতের খবর',
    nextShowEn: 'Late Night Bulletin',
    isHd: true,
    epg: [
      { id: 'epg-jm-1', time: '০৫:৩০ PM', title: 'স্পটলাইট বাংলাদেশ', titleEn: 'Spotlight Bangladesh', category: 'Documentary', duration: '30m' },
      { id: 'epg-jm-2', time: '০৬:০০ PM', title: 'ইনভেস্টিগেটিভ ৩৬০ ডিগ্রি', titleEn: 'Investigative 360', category: 'Investigative', isCurrent: true, duration: '60m' },
      { id: 'epg-jm-3', time: '০৭:০০ PM', title: 'যমুনা বুলেটিন', titleEn: 'Jamuna Evening News', category: 'News', duration: '45m' }
    ]
  },
  {
    id: 'ch-btv',
    name: 'বিটিভি ওয়ার্ল্ড (BTV World)',
    nameEn: 'BTV World',
    logo: 'https://images.unsplash.com/photo-1579208575657-c595a05383b7?q=80&w=200&auto=format&fit=crop',
    category: 'Bangla',
    streamUrl: STREAM_SAMPLE_1,
    currentShow: 'ঐতিহ্যবাহী বাংলাদেশ ও পল্লীগীতি',
    currentShowEn: 'Traditional Bangladesh & Folk Rhythms',
    nextShow: 'জাতীয় সংবাদ রাত ৮:০০',
    nextShowEn: 'National News Bulletin',
    isHd: true,
    epg: [
      { id: 'epg-bt-1', time: '০৫:০০ PM', title: 'তথ্যচিত্র: সুন্দরবনের বাঘ', titleEn: 'Documentary: Sundarbans', category: 'Documentary', duration: '45m' },
      { id: 'epg-bt-2', time: '০৬:০০ PM', title: 'ঐতিহ্যবাহী পল্লীগীতি', titleEn: 'Folk Rhythms of Bengal', category: 'Culture', isCurrent: true, duration: '60m' },
      { id: 'epg-bt-3', time: '০৮:০০ PM', title: 'জাতীয় সংবাদ', titleEn: 'National Prime News', category: 'News', duration: '35m' }
    ]
  },
  {
    id: 'ch-cartoon',
    name: 'কার্টুন নেটওয়ার্ক (Cartoon Network)',
    nameEn: 'Cartoon Network Kids',
    logo: 'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=200&auto=format&fit=crop',
    category: 'Kids',
    streamUrl: STREAM_SAMPLE_2,
    currentShow: 'বেন ১০: এলিয়েন ফোর্স (Ben 10)',
    currentShowEn: 'Ben 10: Alien Force',
    nextShow: 'টম অ্যান্ড জেরি অ্যাডভেঞ্চার',
    nextShowEn: 'Tom and Jerry Classic Adventures',
    isHd: true,
    epg: [
      { id: 'epg-cn-1', time: '০৫:০০ PM', title: 'উই বেয়ার বেয়ারস', titleEn: 'We Bare Bears', category: 'Animation', duration: '30m' },
      { id: 'epg-cn-2', time: '০৫:৩০ PM', title: 'বেন ১০: এলিয়েন ফোর্স', titleEn: 'Ben 10: Alien Force', category: 'Action Kids', isCurrent: true, duration: '45m' },
      { id: 'epg-cn-3', time: '০৬:১৫ PM', title: 'টম অ্যান্ড জেরি শো', titleEn: 'Tom and Jerry Classics', category: 'Comedy Animation', duration: '45m' }
    ]
  }
];

// --- LIVE SPORTS MATCHES ---
export const LIVE_SPORTS_EVENTS: SportsEvent[] = [
  {
    id: 'sp-1',
    sport: 'Cricket',
    tournament: 'বিপিএল ২০২৬ (BPL T20)',
    tournamentEn: 'Bangladesh Premier League 2026',
    teamA: {
      name: 'রংপুর রাইডার্স',
      nameEn: 'Rangpur Riders',
      flag: '🏏',
      score: '১৭৮/৪ (১৯.২ ওভার)'
    },
    teamB: {
      name: 'কুমিল্লা ভিক্টোরিয়ান্স',
      nameEn: 'Comilla Victorians',
      flag: '🏆',
      score: '১৭৫/৬ (২০ ওভার)'
    },
    status: 'LIVE',
    time: 'আজ সন্ধ্যা ০৫:৩০ PM',
    venue: 'শের-ই-বাংলা জাতীয় ক্রিকেট স্টেডিয়াম, মিরপুর',
    streamUrl: STREAM_SPORTS_SAMPLE,
    summary: 'রোমাঞ্চকর সমাপ্তির পথে! রংপুর রাইডার্সের শেষ ওভারে প্রয়োজন ৪ বলে ৫ রান। বাবর আজম ও সোহানের অসাধারণ ইনিংস।',
    summaryEn: 'High voltage finish! Rangpur need 5 runs in 4 deliveries. Thrilling contest in Mirpur.'
  },
  {
    id: 'sp-2',
    sport: 'Football',
    tournament: 'ইংলিশ প্রিমিয়ার লিগ (Premier League)',
    tournamentEn: 'English Premier League',
    teamA: {
      name: 'আর্সেনাল',
      nameEn: 'Arsenal',
      flag: '🔴',
      score: '২'
    },
    teamB: {
      name: 'ম্যানচেস্টার সিটি',
      nameEn: 'Manchester City',
      flag: '🔵',
      score: '১'
    },
    status: 'LIVE',
    time: 'আজ রাত ০৮:০০ PM',
    venue: 'এমিরেটস স্টেডিয়াম, লন্ডন',
    streamUrl: STREAM_SAMPLE_1,
    summary: 'দ্বিতীয়ার্ধে সাকার চোখ ধাঁধানো গোলে আর্সেনাল এগিয়ে! উত্তেজনায় কাঁপছে এমিরেটস স্টেডিয়াম।',
    summaryEn: 'Saka curls in a stunner to give Arsenal the lead in the 74th minute against City.'
  },
  {
    id: 'sp-3',
    sport: 'Football',
    tournament: 'উয়েফা চ্যাম্পিয়ন্স লিগ (UEFA Champions League)',
    tournamentEn: 'UEFA Champions League Quarterfinal',
    teamA: {
      name: 'রিয়াল মাদ্রিদ',
      nameEn: 'Real Madrid',
      flag: '⚪',
      score: '০'
    },
    teamB: {
      name: 'বায়ার্ন মিউনিখ',
      nameEn: 'Bayern Munich',
      flag: '🔴',
      score: '০'
    },
    status: 'UPCOMING',
    time: 'আগামীকাল রাত ০১:৪৫ AM',
    venue: 'সান্তিয়াগো বার্নাব্যু, মাদ্রিদ',
    streamUrl: STREAM_SAMPLE_3,
    summary: 'ইউরোপ সেরা হওয়ার মহাযুদ্ধ! ভিনিসিউস জুনিয়র বনাম হ্যারি কেনের আগুনে লড়াই।',
    summaryEn: 'Epic European clash under the Santiago Bernabéu lights.'
  },
  {
    id: 'sp-4',
    sport: 'Cricket',
    tournament: 'আইসিসি বিশ্বকাপ প্রস্তুতি ম্যাচ',
    tournamentEn: 'ICC World Cup Warm-up',
    teamA: {
      name: 'বাংলাদেশ',
      nameEn: 'Bangladesh Tigers',
      flag: '🇧🇩'
    },
    teamB: {
      name: 'অস্ট্রেলিয়া',
      nameEn: 'Australia',
      flag: '🇦🇺'
    },
    status: 'UPCOMING',
    time: 'শুক্রবার দুপুর ০২:০০ PM',
    venue: 'চট্টগ্রাম জহুর আহমেদ চৌধুরী স্টেডিয়াম',
    streamUrl: STREAM_SPORTS_SAMPLE,
    summary: 'ঘরের মাঠে অজিদের বিরুদ্ধে টাইগারদের কঠিন লড়াই। সাকিব ও মিরাজের ঘূর্ণি আক্রমণ প্রস্তুত।',
    summaryEn: 'Tigers prepare for a grand clash against the Aussie firepower in Chattogram.'
  }
];

// --- YOUTUBE INTEGRATION & SHORTS ---
export const YOUTUBE_SHORTS: YouTubeShort[] = [
  {
    id: 'sh-1',
    title: 'আফরান নিশোর সেরা ডায়লগ ডেলিভারি 🔥',
    titleEn: 'Afran Nisho Best Dialogue Delivery',
    channelName: 'Bangla Drama World',
    channelAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=120&auto=format&fit=crop',
    likes: '148K',
    comments: '2.4K',
    videoUrl: STREAM_SAMPLE_5,
    tags: ['#AfranNisho', '#BanglaNatok', '#Acting']
  },
  {
    id: 'sh-2',
    title: 'চঞ্চল চৌধুরীর হাওয়া সিনেমার বিহাইন্ড দ্য সিন 🌊',
    titleEn: 'Hawa Movie BTS with Chanchal Chowdhury',
    channelName: 'Cinematic Bengal',
    channelAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=120&auto=format&fit=crop',
    likes: '230K',
    comments: '4.8K',
    videoUrl: STREAM_SAMPLE_1,
    tags: ['#Hawa', '#ChanchalChowdhury', '#Cinema']
  },
  {
    id: 'sh-3',
    title: 'বিপিএলে শেষ বলে ছক্কা মেরে ম্যাচ জয়! 🏏',
    titleEn: 'Last Ball Six in BPL T20',
    channelName: 'Cricket Craze BD',
    channelAvatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=120&auto=format&fit=crop',
    likes: '512K',
    comments: '9.1K',
    videoUrl: STREAM_SPORTS_SAMPLE,
    tags: ['#BPL2026', '#Cricket', '#BangladeshCricket']
  },
  {
    id: 'sh-4',
    title: 'মেহজাবীনের ইমোশনাল সিন শুটিং চলাকালীন কান্নার দৃশ্য',
    titleEn: 'Mehazabien Emotional Scene Tears BTS',
    channelName: 'Telefilm Diaries',
    channelAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=120&auto=format&fit=crop',
    likes: '185K',
    comments: '3.1K',
    videoUrl: STREAM_SAMPLE_2,
    tags: ['#Mehazabien', '#Emotional', '#BanglaDrama']
  }
];

// --- YOUTUBE MUSIC MODE TRACKS ---
export const YOUTUBE_MUSIC_TRACKS: YouTubeMusicTrack[] = [
  {
    id: 'yt-music-1',
    title: 'সাদা সাদা কালা কালা (লো-ফাই সংস্করণ)',
    titleEn: 'Shada Shada Kala Kala (Lo-Fi Chill)',
    artist: 'হাশিম মাহমুদ / হাওয়া ফিল্ম',
    album: 'Hawa Acoustic Sessions',
    duration: '3:45',
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400&auto=format&fit=crop',
    audioUrl: STREAM_SAMPLE_3
  },
  {
    id: 'yt-music-2',
    title: 'ঈশ্বর (Priyotoma Original Sound Track)',
    titleEn: 'Ishwar (Priyotoma OST)',
    artist: 'রিয়াদ ও প্রিন্স মাহমুদ',
    album: 'Priyotoma Movie Album',
    duration: '4:12',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400&auto=format&fit=crop',
    audioUrl: STREAM_SAMPLE_4
  },
  {
    id: 'yt-music-3',
    title: 'তুমি যাকে ভালোবাসো (Romantic Unplugged)',
    titleEn: 'Tumi Jake Bhalobasho',
    artist: 'ইমন চক্রবর্তী',
    album: 'Bengali Soul Classics',
    duration: '4:38',
    cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&auto=format&fit=crop',
    audioUrl: STREAM_SAMPLE_2
  },
  {
    id: 'yt-music-4',
    title: 'Interstellar Main Theme (Hans Zimmer Suite)',
    titleEn: 'Interstellar Main Theme (Hans Zimmer)',
    artist: 'Hans Zimmer',
    album: 'Interstellar OST',
    duration: '5:10',
    cover: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400&auto=format&fit=crop',
    audioUrl: STREAM_SAMPLE_1
  }
];

// Bangladersh famous actors / stars
export const BANGLA_STARS = [
  { name: 'আফরান নিশো', nameEn: 'Afran Nisho', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop', count: 18, filterKey: 'Afran Nisho' },
  { name: 'চঞ্চল চৌধুরী', nameEn: 'Chanchal Chowdhury', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop', count: 24, filterKey: 'Chanchal Chowdhury' },
  { name: 'মোশাররফ করিম', nameEn: 'Mosharraf Karim', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop', count: 32, filterKey: 'Mosharraf Karim' },
  { name: 'মেহজাবীন চৌধুরী', nameEn: 'Mehazabien Chowdhury', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop', count: 22, filterKey: 'Mehazabien' },
  { name: 'জিয়াউল ফারুক অপূর্ব', nameEn: 'Ziaul Faruq Apurba', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop', count: 27, filterKey: 'Apurba' }
];
