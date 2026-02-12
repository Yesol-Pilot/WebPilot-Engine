/**
 * skybox_library.ts
 * 
 * 스카이박스/HDRI 리소스 레지스트리
 * CDN(Polyhaven, 수동) + 로컬 파일(자동 레지스트리) 통합
 * 
 * 로컬 스카이박스는 _registry.json에서 자동 로드됨
 * → npm run build:registry 실행 시 자동 갱신
 */

export interface SkyboxData {
    id: string;
    name: string;
    tags: string[];
    category: string;
    url: string;
    thumbnail: string;
}

// _registry.json 자동 로드 (build-asset-registry.ts가 생성)
let skyboxRegistryEntries: Record<string, SkyboxData> = {};
try {
    const registry = require('../../public/skybox/_registry.json');
    if (registry?.entries) {
        for (const entry of registry.entries) {
            skyboxRegistryEntries[entry.id] = {
                id: entry.id,
                name: entry.name || entry.id,
                tags: entry.tags || [],
                category: entry.category || 'generated',
                url: entry.url,
                thumbnail: entry.thumbnail || entry.url,
            };
        }
    }
} catch {
    console.warn('[skybox_library] _registry.json 미발견 — CDN 엔트리만 사용');
}

export const SKYBOX_LIBRARY: Record<string, SkyboxData> = {
    // Polyhaven CDN 엔트리 (수동)
    "kloofendal_48d_partly_cloudy_puresky": {
        id: "kloofendal_48d_partly_cloudy_puresky",
        name: "Kloofendal 48d Partly Cloudy (Pure Sky)",
        tags: ["pure skies"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/kloofendal_48d_partly_cloudy_puresky_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/kloofendal_48d_partly_cloudy_puresky.png?width=256&height=256"
    },
    "lilienstein": {
        id: "lilienstein",
        name: "Lilienstein",
        tags: ["sun", "grass", "field", "forest", "meadow"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/lilienstein_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/lilienstein.png?width=256&height=256"
    },
    "moonless_golf": {
        id: "moonless_golf",
        name: "Moonless Golf",
        tags: ["grass", "golf", "stars", "milky way", "field"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/moonless_golf_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/moonless_golf.png?width=256&height=256"
    },
    "brown_photostudio_02": {
        id: "brown_photostudio_02",
        name: "Brown Photostudio 02",
        tags: ["bed", "studio", "fluorescent", "window", "couch", "chair", "photo", "table", "kitchen", "fridge", "backplates"],
        category: "urban",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/brown_photostudio_02_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/brown_photostudio_02.png?width=256&height=256"
    },
    "studio_small_09": {
        id: "studio_small_09",
        name: "Studio Small 09",
        tags: ["umbrella", "softbox", "infinity", "lamp", "studio", "photo"],
        category: "medium contrast",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_09_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/studio_small_09.png?width=256&height=256"
    },
    "dikhololo_night": {
        id: "dikhololo_night",
        name: "Dikhololo Night",
        tags: ["bush", "grass", "road", "safari", "tree", "veld", "milky way", "stars", "astronomy"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/dikhololo_night_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/dikhololo_night.png?width=256&height=256"
    },
    "satara_night": {
        id: "satara_night",
        name: "Satara Night",
        tags: ["stars", "tree", "lamp", "milky way", "galaxy", "hut"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/satara_night_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/satara_night.png?width=256&height=256"
    },
    "kloppenheim_02": {
        id: "kloppenheim_02",
        name: "Kloppenheim 02",
        tags: ["dark", "stars", "moon", "galaxy"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/kloppenheim_02_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/kloppenheim_02.png?width=256&height=256"
    },
    "the_sky_is_on_fire": {
        id: "the_sky_is_on_fire",
        name: "The Sky Is On Fire",
        tags: ["twilight", "rail", "promenade", "path", "ocean", "wave", "backplates"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/the_sky_is_on_fire_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/the_sky_is_on_fire.png?width=256&height=256"
    },
    "studio_small_08": {
        id: "studio_small_08",
        name: "Studio Small 08",
        tags: ["umbrella", "softbox", "infinity", "lamp", "studio", "photo"],
        category: "low contrast",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_08_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/studio_small_08.png?width=256&height=256"
    },
    "studio_small_03": {
        id: "studio_small_03",
        name: "Studio Small 03",
        tags: ["lamp", "studio", "photo", "umbrella"],
        category: "indoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_03_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/studio_small_03.png?width=256&height=256"
    },
    "spruit_sunrise": {
        id: "spruit_sunrise",
        name: "Spruit Sunrise",
        tags: ["tree", "sun", "grass", "path", "field", "park", "mist", "power line"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/spruit_sunrise_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/spruit_sunrise.png?width=256&height=256"
    },
    "satara_night_no_lamps": {
        id: "satara_night_no_lamps",
        name: "Satara Night (No Lamps)",
        tags: ["stars", "tree", "milky way", "galaxy"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/satara_night_no_lamps_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/satara_night_no_lamps.png?width=256&height=256"
    },
    "canary_wharf": {
        id: "canary_wharf",
        name: "Canary Wharf",
        tags: ["europe", "london", "architecture", "city", "building", "railing", "concrete", "street"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/canary_wharf_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/canary_wharf.png?width=256&height=256"
    },
    "wide_street_01": {
        id: "wide_street_01",
        name: "Wide Street 01",
        tags: ["sun", "road", "street", "asphalt", "city", "backplates"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/wide_street_01_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/wide_street_01.png?width=256&height=256"
    },
    "shanghai_bund": {
        id: "shanghai_bund",
        name: "Shanghai Bund",
        tags: ["skyscraper", "skyline", "china", "neon", "promenade", "building", "architecture", "street", "city", "square", "balcony", "shanghai"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/shanghai_bund_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/shanghai_bund.png?width=256&height=256"
    },
    "kloppenheim_06_puresky": {
        id: "kloppenheim_06_puresky",
        name: "Kloppenheim 06 (Pure Sky)",
        tags: ["pure skies"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/kloppenheim_06_puresky_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/kloppenheim_06_puresky.png?width=256&height=256"
    },
    "meadow_2": {
        id: "meadow_2",
        name: "Meadow 2",
        tags: ["grass", "tree", "sun", "clearing", "path", "park", "backplates"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/meadow_2_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/meadow_2.png?width=256&height=256"
    },
    "kiara_1_dawn": {
        id: "kiara_1_dawn",
        name: "Kiara 1 Dawn",
        tags: ["mountain", "valley", "rock", "backplates"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/kiara_1_dawn_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/kiara_1_dawn.png?width=256&height=256"
    },
    "je_gray_02": {
        id: "je_gray_02",
        name: "J&E Gray 02",
        tags: ["forest", "grass", "pine", "sun"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/je_gray_02_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/je_gray_02.png?width=256&height=256"
    },
    "belfast_sunset_puresky": {
        id: "belfast_sunset_puresky",
        name: "Belfast Sunset (Pure Sky)",
        tags: ["pure skies"],
        category: "natural light",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/belfast_sunset_puresky_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/belfast_sunset_puresky.png?width=256&height=256"
    },
    "noon_grass": {
        id: "noon_grass",
        name: "Noon Grass",
        tags: ["tree", "sun", "grass"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/noon_grass_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/noon_grass.png?width=256&height=256"
    },
    "venice_sunset": {
        id: "venice_sunset",
        name: "Venice Sunset",
        tags: ["sun", "europe", "architecture", "building", "street", "town", "ocean", "river", "cobblestone"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/venice_sunset_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/venice_sunset.png?width=256&height=256"
    },
    "photo_studio_01": {
        id: "photo_studio_01",
        name: "Photo Studio 01",
        tags: ["lamp", "photo", "fluorescent", "bed", "white", "infinity", "chair", "backplates"],
        category: "indoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/photo_studio_01_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/photo_studio_01.png?width=256&height=256"
    },
    "kloppenheim_06": {
        id: "kloppenheim_06",
        name: "Kloppenheim 06",
        tags: ["sun", "rays", "hill", "rock", "view"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/kloppenheim_06_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/kloppenheim_06.png?width=256&height=256"
    },
    "rooitou_park": {
        id: "rooitou_park",
        name: "Rooitou Park",
        tags: ["sun", "grass", "field", "park"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/rooitou_park_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/rooitou_park.png?width=256&height=256"
    },
    "rural_asphalt_road": {
        id: "rural_asphalt_road",
        name: "Rural Asphalt Road",
        tags: ["sun", "grass", "field", "tree", "asphalt", "road"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/rural_asphalt_road_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/rural_asphalt_road.png?width=256&height=256"
    },
    "sunflowers": {
        id: "sunflowers",
        name: "Sunflowers",
        tags: ["sun", "field", "road", "flower", "asphalt", "backplates"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/sunflowers_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/sunflowers.png?width=256&height=256"
    },
    "spiaggia_di_mondello": {
        id: "spiaggia_di_mondello",
        name: "Spiaggia di Mondello",
        tags: ["tree", "sun", "beach", "sand"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/spiaggia_di_mondello_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/spiaggia_di_mondello.png?width=256&height=256"
    },
    "autumn_field_puresky": {
        id: "autumn_field_puresky",
        name: "Autumn Field (Pure Sky)",
        tags: ["pure skies"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/autumn_field_puresky_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/autumn_field_puresky.png?width=256&height=256"
    },
    "autumn_park": {
        id: "autumn_park",
        name: "Autumn Park",
        tags: ["tree", "sun", "grass", "field", "backplates"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/autumn_park_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/autumn_park.png?width=256&height=256"
    },
    "limpopo_golf_course": {
        id: "limpopo_golf_course",
        name: "Limpopo Golf Course",
        tags: ["tree", "sun", "grass", "dam", "pond", "golf"],
        category: "natural light",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/limpopo_golf_course_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/limpopo_golf_course.png?width=256&height=256"
    },
    "scythian_tombs_2": {
        id: "scythian_tombs_2",
        name: "Scythian Tombs 2",
        tags: ["grass", "field", "sun", "backplates"],
        category: "natural light",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/scythian_tombs_2_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/scythian_tombs_2.png?width=256&height=256"
    },
    "moonlit_golf": {
        id: "moonlit_golf",
        name: "Moonlit Golf",
        tags: ["moon", "field", "stars", "grass", "tree"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/moonlit_golf_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/moonlit_golf.png?width=256&height=256"
    },
    "je_gray_park": {
        id: "je_gray_park",
        name: "J&E Gray Park",
        tags: ["grass", "field", "sun"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/je_gray_park_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/je_gray_park.png?width=256&height=256"
    },
    "symmetrical_garden_02": {
        id: "symmetrical_garden_02",
        name: "Symmetrical Garden 02",
        tags: ["grass", "garden", "sun", "plants", "hedge", "park"],
        category: "natural light",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/symmetrical_garden_02_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/symmetrical_garden_02.png?width=256&height=256"
    },
    "overcast_soil_puresky": {
        id: "overcast_soil_puresky",
        name: "Overcast Soil (Pure Sky)",
        tags: ["pure skies"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/overcast_soil_puresky_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/overcast_soil_puresky.png?width=256&height=256"
    },
    "sunflowers_puresky": {
        id: "sunflowers_puresky",
        name: "Sunflowers (Pure Sky)",
        tags: ["pure skies"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/sunflowers_puresky_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/sunflowers_puresky.png?width=256&height=256"
    },
    "preller_drive": {
        id: "preller_drive",
        name: "Preller Drive",
        tags: ["tree", "long grass", "house", "street light", "power line", "stars"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/preller_drive_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/preller_drive.png?width=256&height=256"
    },
    "industrial_sunset_puresky": {
        id: "industrial_sunset_puresky",
        name: "Industrial Sunset (Pure Sky)",
        tags: ["pure skies"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/industrial_sunset_puresky_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/industrial_sunset_puresky.png?width=256&height=256"
    },
    "cannon": {
        id: "cannon",
        name: "Cannon",
        tags: ["rock", "hill", "view", "cannon", "ocean", "mountain"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/cannon_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/cannon.png?width=256&height=256"
    },
    "umhlanga_sunrise": {
        id: "umhlanga_sunrise",
        name: "Umhlanga Sunrise",
        tags: ["sun", "beach", "ocean", "wave", "sand", "backplates"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/umhlanga_sunrise_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/umhlanga_sunrise.png?width=256&height=256"
    },
    "buikslotermeerplein": {
        id: "buikslotermeerplein",
        name: "Buikslotermeerplein",
        tags: ["grass", "park", "skate", "graffiti", "field", "building", "architecture", "city", "europe", "amsterdam"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/buikslotermeerplein_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/buikslotermeerplein.png?width=256&height=256"
    },
    "resting_place": {
        id: "resting_place",
        name: "Resting Place",
        tags: ["sun", "grass", "field", "tree", "dam", "lake", "park", "hut", "cabin"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/resting_place_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/resting_place.png?width=256&height=256"
    },
    "alps_field": {
        id: "alps_field",
        name: "Alps Field",
        tags: ["sun", "grass", "field", "mountain", "forest", "alps", "valley"],
        category: "natural light",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/alps_field_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/alps_field.png?width=256&height=256"
    },
    "immenstadter_horn": {
        id: "immenstadter_horn",
        name: "Immenstädter Horn",
        tags: ["sun", "tree", "grass", "hilltop", "hill", "fence"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/immenstadter_horn_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/immenstadter_horn.png?width=256&height=256"
    },
    "golden_gate_hills": {
        id: "golden_gate_hills",
        name: "Golden Gate Hills",
        tags: ["sun", "grass", "hilltop", "mountain", "view", "rock"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/golden_gate_hills_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/golden_gate_hills.png?width=256&height=256"
    },
    "sunset_jhbcentral": {
        id: "sunset_jhbcentral",
        name: "Joburg Central Sunset",
        tags: ["city", "roof", "skyline", "building", "architecture", "industrial", "pink", "twilight"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/sunset_jhbcentral_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/sunset_jhbcentral.png?width=256&height=256"
    },
    "rogland_clear_night": {
        id: "rogland_clear_night",
        name: "Rogland Clear Night",
        tags: ["stars", "milky way", "galaxy", "astronomy", "dark", "rocky", "arid", "desert"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/rogland_clear_night_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/rogland_clear_night.png?width=256&height=256"
    },
    "oberer_kuhberg": {
        id: "oberer_kuhberg",
        name: "Oberer Kuhberg",
        tags: ["sun", "grass", "field", "fort", "tower"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/oberer_kuhberg_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/oberer_kuhberg.png?width=256&height=256"
    },
    "meadow": {
        id: "meadow",
        name: "Meadow",
        tags: ["grass", "tree", "clearing", "green", "peaceful", "backplates"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/meadow_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/meadow.png?width=256&height=256"
    },
    "cayley_interior": {
        id: "cayley_interior",
        name: "Cayley Interior",
        tags: ["lamp", "table", "window", "glass", "balcony", "view", "log"],
        category: "indoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/cayley_interior_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/cayley_interior.png?width=256&height=256"
    },
    "fireplace": {
        id: "fireplace",
        name: "Fireplace",
        tags: ["fire", "couch", "room", "lounge"],
        category: "indoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/fireplace_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/fireplace.png?width=256&height=256"
    },
    "belfast_farmhouse": {
        id: "belfast_farmhouse",
        name: "Belfast Farmhouse",
        tags: ["tree", "sun", "grass", "hill"],
        category: "natural light",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/belfast_farmhouse_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/belfast_farmhouse.png?width=256&height=256"
    },
    "drackenstein_quarry": {
        id: "drackenstein_quarry",
        name: "Drackenstein Quarry",
        tags: ["hill", "hilltop", "grass", "field", "sun"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/drackenstein_quarry_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/drackenstein_quarry.png?width=256&height=256"
    },
    "wide_street_02": {
        id: "wide_street_02",
        name: "Wide Street 02",
        tags: ["asphalt", "city", "road", "street", "sun", "backplates"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/wide_street_02_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/wide_street_02.png?width=256&height=256"
    },
    "dreifaltigkeitsberg": {
        id: "dreifaltigkeitsberg",
        name: "Dreifaltigkeitsberg",
        tags: ["field", "tree", "grass", "sun"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/dreifaltigkeitsberg_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/dreifaltigkeitsberg.png?width=256&height=256"
    },
    "clarens_midday": {
        id: "clarens_midday",
        name: "Clarens Midday",
        tags: ["mountain", "hilltop", "grass", "shrub", "valley", "lookout"],
        category: "natural light",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/clarens_midday_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/clarens_midday.png?width=256&height=256"
    },
    "spaichingen_hill": {
        id: "spaichingen_hill",
        name: "Spaichingen Hill",
        tags: ["sun", "grass", "field", "tree", "hilltop"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/spaichingen_hill_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/spaichingen_hill.png?width=256&height=256"
    },
    "studio_garden": {
        id: "studio_garden",
        name: "Studio Garden",
        tags: ["tree", "warehouse", "garden", "grass", "bench", "path", "chair", "arch", "backplates"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_garden_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/studio_garden.png?width=256&height=256"
    },
    "goegap": {
        id: "goegap",
        name: "Goegap",
        tags: ["sand", "dirt", "rock", "desert", "desolate", "sun"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/goegap_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/goegap.png?width=256&height=256"
    },
    "mud_road_puresky": {
        id: "mud_road_puresky",
        name: "Mud Road (Pure Sky)",
        tags: ["pure skies"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/mud_road_puresky_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/mud_road_puresky.png?width=256&height=256"
    },
    "hilly_terrain_01": {
        id: "hilly_terrain_01",
        name: "Hilly Terrain 01",
        tags: ["grass", "hill", "field", "view", "hilltop"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/hilly_terrain_01_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/hilly_terrain_01.png?width=256&height=256"
    },
    "sunset_in_the_chalk_quarry": {
        id: "sunset_in_the_chalk_quarry",
        name: "Sunset in the Chalk Quarry",
        tags: ["sun", "hill", "sand"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/sunset_in_the_chalk_quarry_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/sunset_in_the_chalk_quarry.png?width=256&height=256"
    },
    "cape_hill": {
        id: "cape_hill",
        name: "Cape Hill",
        tags: ["rock", "shrub", "view", "ocean", "hill", "hilltop", "sun", "backplates"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/cape_hill_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/cape_hill.png?width=256&height=256"
    },
    "green_point_park": {
        id: "green_point_park",
        name: "Green Point Park",
        tags: ["sun", "grass", "buildings", "mountain", "field", "backplates"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/green_point_park_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/green_point_park.png?width=256&height=256"
    },
    "evening_road_01_puresky": {
        id: "evening_road_01_puresky",
        name: "Evening Road 01 (Pure Sky)",
        tags: ["pure skies"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/evening_road_01_puresky_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/evening_road_01_puresky.png?width=256&height=256"
    },
    "christmas_photo_studio_01": {
        id: "christmas_photo_studio_01",
        name: "Christmas Photo Studio 01",
        tags: ["couch", "sofa", "wood", "book", "blanket", "tree", "christmas", "step", "ladder", "studio", "backplates"],
        category: "indoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/christmas_photo_studio_01_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/christmas_photo_studio_01.png?width=256&height=256"
    },
    "pretoria_gardens": {
        id: "pretoria_gardens",
        name: "Pretoria Gardens",
        tags: ["sun", "grass", "field", "tree", "park"],
        category: "high contrast",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/pretoria_gardens_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/pretoria_gardens.png?width=256&height=256"
    },
    "brown_photostudio_01": {
        id: "brown_photostudio_01",
        name: "Brown Photostudio 01",
        tags: ["studio", "lamp", "photo", "chair", "window", "wood", "fluorescent", "couch", "victorian", "backplates"],
        category: "indoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/brown_photostudio_01_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/brown_photostudio_01.png?width=256&height=256"
    },
    "delta_2": {
        id: "delta_2",
        name: "Delta 2",
        tags: ["grass", "tree", "bench", "park", "fence", "hill", "lake", "dam", "sun"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/delta_2_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/delta_2.png?width=256&height=256"
    },
    "hansaplatz": {
        id: "hansaplatz",
        name: "Hansaplatz",
        tags: ["tree", "shop", "building", "city", "police", "district"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/hansaplatz_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/hansaplatz.png?width=256&height=256"
    },
    "kloofendal_48d_partly_cloudy": {
        id: "kloofendal_48d_partly_cloudy",
        name: "Kloofendal 48d Partly Cloudy",
        tags: ["sun", "grass", "rock", "view"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/kloofendal_48d_partly_cloudy_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/kloofendal_48d_partly_cloudy.png?width=256&height=256"
    },
    "studio_small_02": {
        id: "studio_small_02",
        name: "Studio Small 02",
        tags: ["lamp", "studio", "photo"],
        category: "indoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_02_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/studio_small_02.png?width=256&height=256"
    },
    "photo_studio_loft_hall": {
        id: "photo_studio_loft_hall",
        name: "Photo Studio Loft Hall",
        tags: ["couch", "wood", "sunny", "apartment", "backplates"],
        category: "indoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/photo_studio_loft_hall_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/photo_studio_loft_hall.png?width=256&height=256"
    },
    "kloofendal_43d_clear_puresky": {
        id: "kloofendal_43d_clear_puresky",
        name: "Kloofendal 43d Clear (Pure Sky)",
        tags: ["pure skies"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/kloofendal_43d_clear_puresky_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/kloofendal_43d_clear_puresky.png?width=256&height=256"
    },
    "sunset_fairway": {
        id: "sunset_fairway",
        name: "Sunset Fairway",
        tags: ["golf", "grass", "tree", "pond", "path", "tee", "mountain"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/sunset_fairway_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/sunset_fairway.png?width=256&height=256"
    },
    "abandoned_tank_farm_04": {
        id: "abandoned_tank_farm_04",
        name: "Abandoned Tank Farm 04",
        tags: ["sun", "grass", "field", "hill", "backplates"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/abandoned_tank_farm_04_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/abandoned_tank_farm_04.png?width=256&height=256"
    },
    "evening_meadow": {
        id: "evening_meadow",
        name: "Evening Meadow",
        tags: ["grass", "field", "tree", "meadow"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/evening_meadow_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/evening_meadow.png?width=256&height=256"
    },
    "belfast_sunset": {
        id: "belfast_sunset",
        name: "Belfast Sunset",
        tags: ["grass", "hill", "hilltop", "field", "view", "dry", "dry grass"],
        category: "natural light",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/belfast_sunset_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/belfast_sunset.png?width=256&height=256"
    },
    "lebombo": {
        id: "lebombo",
        name: "Lebombo",
        tags: ["house", "lamp", "window", "wood floor", "empty"],
        category: "indoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/lebombo_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/lebombo.png?width=256&height=256"
    },
    "rosendal_plains_2": {
        id: "rosendal_plains_2",
        name: "Rosendal Plains 2",
        tags: ["sun", "grass", "view", "landscape", "rock", "farm"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/rosendal_plains_2_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/rosendal_plains_2.png?width=256&height=256"
    },
    "snowy_park_01": {
        id: "snowy_park_01",
        name: "Snowy Park 01",
        tags: ["snow", "tree", "winter"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/snowy_park_01_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/snowy_park_01.png?width=256&height=256"
    },
    "autumn_field": {
        id: "autumn_field",
        name: "Autumn Field",
        tags: ["sun", "grass", "field", "green", "farm", "long grass", "backplates"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/autumn_field_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/autumn_field.png?width=256&height=256"
    },
    "studio_small_05": {
        id: "studio_small_05",
        name: "Studio Small 05",
        tags: ["lamp", "studio", "photo", "reflector", "dish"],
        category: "indoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_05_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/studio_small_05.png?width=256&height=256"
    },
    "cloud_layers": {
        id: "cloud_layers",
        name: "Cloud Layers",
        tags: ["sun", "grass", "path"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/cloud_layers_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/cloud_layers.png?width=256&height=256"
    },
    "solitude_night": {
        id: "solitude_night",
        name: "Solitude Night",
        tags: ["field", "moon", "grass", "architecture"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/solitude_night_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/solitude_night.png?width=256&height=256"
    },
    "urban_street_04": {
        id: "urban_street_04",
        name: "Urban Street 04",
        tags: ["road", "street", "london", "europe", "asphalt"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/urban_street_04_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/urban_street_04.png?width=256&height=256"
    },
    "sunny_vondelpark": {
        id: "sunny_vondelpark",
        name: "Sunny Vondelpark",
        tags: ["tree", "grass", "sun", "leaves", "autumn", "path", "sunrise"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/sunny_vondelpark_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/sunny_vondelpark.png?width=256&height=256"
    },
    "rooftop_night": {
        id: "rooftop_night",
        name: "Rooftop Night",
        tags: ["parking", "moon", "twilight", "roof", "concrete"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/rooftop_night_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/rooftop_night.png?width=256&height=256"
    },
    "little_paris_eiffel_tower": {
        id: "little_paris_eiffel_tower",
        name: "Little Paris Eiffel Tower",
        tags: ["bridge", "cobblestone", "bicycle", "fountain", "restaurant", "padlock", "cafe"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/little_paris_eiffel_tower_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/little_paris_eiffel_tower.png?width=256&height=256"
    },
    "tiergarten": {
        id: "tiergarten",
        name: "Tiergarten",
        tags: ["tree", "grass", "autumn", "leaves", "field", "park"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/tiergarten_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/tiergarten.png?width=256&height=256"
    },
    "studio_small_04": {
        id: "studio_small_04",
        name: "Studio Small 04",
        tags: ["lamp", "studio", "photo"],
        category: "indoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_04_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/studio_small_04.png?width=256&height=256"
    },
    "chinese_garden": {
        id: "chinese_garden",
        name: "Chinese Garden",
        tags: ["sun", "tree", "pond", "garden", "asia", "architecture", "china", "cobblestone"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/chinese_garden_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/chinese_garden.png?width=256&height=256"
    },
    "industrial_sunset_02_puresky": {
        id: "industrial_sunset_02_puresky",
        name: "Industrial Sunset 02 (Pure Sky)",
        tags: ["pure skies"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/industrial_sunset_02_puresky_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/industrial_sunset_02_puresky.png?width=256&height=256"
    },
    "citrus_orchard_road_puresky": {
        id: "citrus_orchard_road_puresky",
        name: "Citrus Orchard Road (Pure Sky)",
        tags: ["pure skies"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/citrus_orchard_road_puresky_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/citrus_orchard_road_puresky.png?width=256&height=256"
    },
    "studio_small_01": {
        id: "studio_small_01",
        name: "Studio Small 01",
        tags: ["lamp", "studio", "photo"],
        category: "indoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_01_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/studio_small_01.png?width=256&height=256"
    },
    "driving_school": {
        id: "driving_school",
        name: "Driving School",
        tags: ["parking", "road", "asphalt", "tire", "backplates"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/driving_school_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/driving_school.png?width=256&height=256"
    },
    "urban_street_01": {
        id: "urban_street_01",
        name: "Urban Street 01",
        tags: ["europe", "london", "tree", "road", "asphalt", "car", "street", "building", "city"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/urban_street_01_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/urban_street_01.png?width=256&height=256"
    },
    "neuer_zollhof": {
        id: "neuer_zollhof",
        name: "Neuer Zollhof",
        tags: ["lamp", "architecture", "europe", "building", "street", "city", "square"],
        category: "outdoor",
        url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/neuer_zollhof_1k.hdr",
        thumbnail: "https://cdn.polyhaven.com/asset_img/thumbs/neuer_zollhof.png?width=256&height=256"
    },

    // ===== GENERATED SKYBOXES (자동 로드: _registry.json → build-asset-registry.ts 생성) =====
    // npm run build:registry 실행 시 자동 갱신
    ...skyboxRegistryEntries,
};

export function findSkyboxByKeyword(keyword: string): SkyboxData | null {
    const lowerKey = keyword.toLowerCase();

    const values = Object.values(SKYBOX_LIBRARY);

    // 1. Precise Match on ID
    if (SKYBOX_LIBRARY[keyword]) return SKYBOX_LIBRARY[keyword];

    // 2. Name or Tag match
    const candidates = values.filter(sky => {
        if (sky.name.toLowerCase().includes(lowerKey)) return true;
        if (sky.tags.some(t => t.toLowerCase() === lowerKey)) return true;
        if (sky.category.toLowerCase().includes(lowerKey)) return true;
        return false;
    });

    if (candidates.length > 0) {
        // Return random or first? 
        // For variety, let's return a random one from top 3 matches?
        // Actually, just random from candidates is fine for "mood" matching
        return candidates[Math.floor(Math.random() * candidates.length)];
    }

    return null;
}

// Helper to get a random skybox
export function getRandomSkybox(): SkyboxData {
    const values = Object.values(SKYBOX_LIBRARY);
    return values[Math.floor(Math.random() * values.length)];
}
