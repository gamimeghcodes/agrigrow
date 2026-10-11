import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Lightbulb, ChevronRight, Droplets, Sprout, Cpu, Tractor, Landmark, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/farmer/modern-farming")({
  head: () => ({ meta: [{ title: "Modern Farming — AgriVerse" }] }),
  component: ModernFarming,
});

type Technique = {
  term: string;
  category: string;
  summary: string;
  whyItHelps: string;
  steps: string[];
  requirements: string;
};

const MODERN_FARMING_TECHNIQUES: Technique[] = [
  { 
    term: "Aeroponics", 
    category: "Structures & Growing Methods", 
    summary: "Growing plants with roots suspended in air, misted with nutrient solution; no soil or growing medium needed.", 
    whyItHelps: "Uses minimal water and space while maximizing growth speed.",
    steps: [
      "Set up a closed environment (like a greenhouse or indoor grow room).",
      "Install A-frame or vertical racks to suspend plant roots.",
      "Set up a reservoir with water and a precisely balanced nutrient mix.",
      "Install a high-pressure misting system directed at the roots.",
      "Use timers to spray roots for a few seconds every few minutes.",
      "Monitor pH and nutrient levels daily."
    ],
    requirements: "High initial investment, uninterrupted power supply, precise nutrient monitoring."
  },
  { 
    term: "AI-Based Pest & Disease Detection", 
    category: "Tech & Monitoring", 
    summary: "Using a phone camera + AI model to identify crop diseases/pests early from a leaf photo.", 
    whyItHelps: "Helps farmers catch and treat diseases before they spread and destroy the crop.",
    steps: [
      "Download a trusted agriculture app with AI detection (e.g., Plantix, AgriGrow).",
      "Walk through your field regularly to check for discolored or damaged leaves.",
      "Take a clear, close-up photo of the affected leaf in good lighting.",
      "Upload the photo to the app for instant analysis.",
      "Review the app's diagnosis and recommended chemical or organic treatments.",
      "Apply the recommended treatment only to the affected area."
    ],
    requirements: "Smartphone with a camera and internet connection."
  },
  { 
    term: "Biofertilizers & Biopesticides", 
    category: "Soil & Inputs", 
    summary: "Living microorganism-based inputs that improve soil nutrients or control pests without synthetic chemicals.", 
    whyItHelps: "Reduces chemical dependency and builds long-term soil fertility.",
    steps: [
      "Identify the specific nutrient deficiency or pest in your field.",
      "Purchase the appropriate bio-input (e.g., Rhizobium for nitrogen, Trichoderma for soil fungi).",
      "Store the bio-inputs in a cool place away from direct sunlight.",
      "Mix the biofertilizer with compost or seed before sowing, or apply it as a soil drench.",
      "Ensure the soil is moist during application to keep the microbes alive.",
      "Avoid mixing bio-inputs with synthetic chemical pesticides."
    ],
    requirements: "Basic knowledge of soil health, reliable source for fresh bio-inputs."
  },
  { 
    term: "Conservation / Zero Tillage", 
    category: "Soil & Inputs", 
    summary: "Planting directly into unplowed soil to preserve soil structure, reduce erosion, and cut fuel/labor costs.", 
    whyItHelps: "Saves tractor fuel and prevents topsoil from blowing or washing away.",
    steps: [
      "Leave the crop residue from the previous harvest on the field.",
      "Use a specialized seed drill (like a Happy Seeder) that can cut through the residue.",
      "Plant new seeds directly into the undisturbed soil.",
      "Manage weeds early using herbicides or manual removal before planting.",
      "Maintain adequate soil moisture during the initial sowing phase."
    ],
    requirements: "Specialized zero-till seed drill equipment, weed management plan."
  },
  { 
    term: "Cover Cropping", 
    category: "Soil & Inputs", 
    summary: "Planting a secondary crop (not for harvest) between main crop cycles to protect and enrich the soil.", 
    whyItHelps: "Prevents weeds, retains moisture, and naturally adds nitrogen back into the soil.",
    steps: [
      "Select a cover crop suited to your soil and season (e.g., Legumes for nitrogen, grasses for erosion).",
      "Sow the cover crop immediately after the main harvest.",
      "Allow it to grow and cover the soil during the off-season.",
      "Before planting the next main crop, cut the cover crop down.",
      "Leave the cut crop on the surface as mulch or plow it lightly into the soil as 'green manure'."
    ],
    requirements: "Extra seeds for the cover crop, a short window between main growing seasons."
  },
  { 
    term: "Crop Rotation", 
    category: "Soil & Inputs", 
    summary: "Systematically changing which crop is grown in a field each season to prevent soil depletion and break pest cycles.", 
    whyItHelps: "Keeps soil healthy and naturally starves pests that target specific crops.",
    steps: [
      "Divide your farm into sections.",
      "Plan a 3 or 4-season cycle (e.g., Cereal -> Legume -> Root Crop -> Fallow).",
      "Ensure you never plant the same crop family in the same section two years in a row.",
      "Keep records of what was planted where each season.",
      "Observe the reduction in specific pests and the improvement in soil texture over time."
    ],
    requirements: "Long-term planning, diverse market access to sell different crops."
  },
  { 
    term: "Drip Irrigation", 
    category: "Irrigation & Water", 
    summary: "Delivering water directly to the root zone through a network of tubes and emitters, cutting water use significantly vs. flooding.", 
    whyItHelps: "Saves massive amounts of water and prevents weed growth between rows.",
    steps: [
      "Design a layout mapping the water source to your crop rows.",
      "Install a main water line with a good filter to prevent emitter clogs.",
      "Lay out the drip tape or lateral pipes along the crop rows.",
      "Punch emitters into the pipes near the root zone of each plant.",
      "Run the system and check for leaks or clogged emitters regularly.",
      "Apply liquid fertilizers directly through the drip system (fertigation)."
    ],
    requirements: "Initial investment in pipes, filters, and a water pump."
  },
  { 
    term: "Drone Technology in Farming", 
    category: "Tech & Monitoring", 
    summary: "Aerial drones used for crop health monitoring, targeted spraying, and field mapping.", 
    whyItHelps: "Allows fast, even spraying of large fields and spots problem areas from above.",
    steps: [
      "Hire a drone service or purchase an agricultural drone.",
      "Map your field boundaries using the drone's software.",
      "For monitoring: fly the drone equipped with multispectral cameras to identify crop stress.",
      "For spraying: fill the drone tank with pesticide/fertilizer, set the flight path, and deploy.",
      "Review the data maps or spraying logs on your computer to plan next steps."
    ],
    requirements: "Capital for hiring/buying, basic technical skills to operate software."
  },
  { 
    term: "Farm Management Apps", 
    category: "Tech & Monitoring", 
    summary: "Mobile/software tools for tracking expenses, crop cycles, labor, and yields digitally instead of on paper.", 
    whyItHelps: "Keeps all farm records in one place to easily track profits and plan ahead.",
    steps: [
      "Download a farm management app on your smartphone.",
      "Set up your farm profile, entering field sizes and crop types.",
      "Log every expense (seeds, fertilizer, labor) immediately when it happens.",
      "Record irrigation dates, chemical applications, and harvest yields.",
      "Use the app's dashboard to see your total costs vs. revenue at the end of the season."
    ],
    requirements: "Smartphone and the discipline to log data regularly."
  },
  { 
    term: "Greenhouse / Polyhouse Farming", 
    category: "Structures & Growing Methods", 
    summary: "Growing crops in a controlled structure to protect against weather and extend the growing season.", 
    whyItHelps: "Protects high-value crops from heavy rain or extreme heat, ensuring consistent yields.",
    steps: [
      "Select a flat site with good sunlight and drainage.",
      "Erect a metal or bamboo frame and cover it with UV-stabilized polythene sheets.",
      "Install ventilation (exhaust fans or side curtains) to manage temperature.",
      "Prepare the soil inside or set up raised beds/hydroponics.",
      "Plant high-value crops like bell peppers, cherry tomatoes, or flowers.",
      "Monitor temperature and humidity daily to prevent fungal diseases."
    ],
    requirements: "High capital investment, continuous monitoring, market access for premium crops."
  },
  { 
    term: "Hydroponics", 
    category: "Structures & Growing Methods", 
    summary: "Growing plants in nutrient-rich water without soil.", 
    whyItHelps: "Allows year-round growing in small spaces with perfectly balanced nutrients.",
    steps: [
      "Set up a greenhouse or indoor space with grow lights.",
      "Choose a system (e.g., Nutrient Film Technique with PVC pipes, or Deep Water Culture).",
      "Place seedlings in net pots supported by a growing medium like clay pebbles.",
      "Mix a water solution with precise amounts of Nitrogen, Phosphorus, Potassium, and micronutrients.",
      "Circulate the water using a pump so roots get nutrients and oxygen.",
      "Regularly test the water pH and electrical conductivity (EC)."
    ],
    requirements: "High capital, technical knowledge of chemistry/pH, reliable power for pumps."
  },
  { 
    term: "IoT Soil Sensors", 
    category: "Tech & Monitoring", 
    summary: "In-field sensors that continuously measure soil moisture, temperature, and nutrients, sending real-time data to the farmer's phone.", 
    whyItHelps: "Takes the guesswork out of watering, ensuring crops get exactly what they need.",
    steps: [
      "Purchase IoT soil sensors from an agricultural tech supplier.",
      "Install the sensors in the soil at various depths across different zones of your field.",
      "Connect the sensors to a central hub via Wi-Fi or LoRaWAN.",
      "Download the companion app to your phone.",
      "Set alerts for when soil moisture drops below a certain percentage.",
      "Only turn on irrigation when the app alerts you that the soil is dry."
    ],
    requirements: "Initial investment in sensors, internet connectivity in the field."
  },
  { 
    term: "Mulching", 
    category: "Soil & Inputs", 
    summary: "Covering soil around plants with organic or plastic material to retain moisture and suppress weeds.", 
    whyItHelps: "Reduces the need for frequent watering and saves labor on weeding.",
    steps: [
      "Prepare the soil and plant your seeds or seedlings.",
      "Choose a mulch material (straw, dry leaves, or specialized agricultural plastic film).",
      "If using plastic, lay it over the beds, secure the edges with soil, and cut holes to plant seedlings.",
      "If using organic mulch, spread a 2-3 inch layer around the base of the plants.",
      "Ensure the mulch does not directly touch the plant stems to prevent rotting."
    ],
    requirements: "Access to organic waste materials or budget for plastic mulch rolls."
  },
  { 
    term: "Precision Agriculture (GPS-Guided Equipment)", 
    category: "Tech & Monitoring", 
    summary: "Using GPS-guided tractors and variable-rate equipment to apply seeds/water/fertilizer only where needed.", 
    whyItHelps: "Prevents overlapping or missing spots in the field, saving expensive inputs.",
    steps: [
      "Equip your tractor with a GPS guidance system and display monitor.",
      "Map your field boundaries and create a grid.",
      "Use the display to steer the tractor in perfectly straight, parallel lines.",
      "Integrate the GPS with your seed drill or sprayer to turn off automatically over areas already covered.",
      "Analyze the GPS data post-harvest to plan for the next season."
    ],
    requirements: "High capital for GPS screens and auto-steer technology."
  },
  { 
    term: "Raised Bed Farming", 
    category: "Structures & Growing Methods", 
    summary: "Growing crops in elevated soil beds for better drainage and easier soil management.", 
    whyItHelps: "Prevents waterlogging around roots, especially during heavy monsoon rains.",
    steps: [
      "Plow the field and break down large soil clods.",
      "Use a bed maker implement on a tractor (or manual labor) to mound the soil.",
      "Create beds that are typically 3-4 feet wide and 6-12 inches high, with walking paths in between.",
      "Incorporate compost and fertilizer directly into the raised beds.",
      "Plant your crops on top of the beds, using the paths for irrigation flow and walking."
    ],
    requirements: "Tractor with bed-making attachments or extra manual labor."
  },
  { 
    term: "Remote Sensing / Satellite Crop Monitoring", 
    category: "Tech & Monitoring", 
    summary: "Using satellite imagery to monitor crop health, water stress, and growth across large areas.", 
    whyItHelps: "Identifies stressed areas of massive fields without having to walk the entire farm.",
    steps: [
      "Subscribe to an agricultural satellite imagery service.",
      "Draw the boundaries of your farm on their digital map.",
      "Receive weekly satellite updates showing NDVI (Normalized Difference Vegetation Index) maps.",
      "Look for red or yellow patches on the map, which indicate plant stress.",
      "Physically visit those specific patches in your field to identify if it's pests, water, or disease."
    ],
    requirements: "Subscription to a software service, large farm size to make it cost-effective."
  },
  { 
    term: "Smart / Sensor-Based Irrigation Systems", 
    category: "Irrigation & Water", 
    summary: "Irrigation that turns on automatically based on real-time soil moisture readings, not a fixed schedule.", 
    whyItHelps: "Eliminates overwatering and underwatering by only running pumps when the soil is actually dry.",
    steps: [
      "Install a drip or sprinkler irrigation system.",
      "Place moisture sensors in the root zones of your crops.",
      "Connect the sensors to a smart irrigation controller wired to your water pump.",
      "Set the desired moisture thresholds on the controller.",
      "The controller will automatically start the pump when soil is dry, and stop it when wet."
    ],
    requirements: "Reliable electricity, smart controllers, and existing pressurized irrigation."
  },
  { 
    term: "Solar-Powered Farm Equipment", 
    category: "Tech & Monitoring", 
    summary: "Solar pumps, dryers, and fencing that cut diesel/electricity costs.", 
    whyItHelps: "Provides reliable power for irrigation off the grid without ongoing diesel costs.",
    steps: [
      "Assess your farm's power needs (e.g., horsepower required for the water pump).",
      "Apply for government subsidies for solar equipment if available.",
      "Install solar panels in an open, unshaded area facing the sun.",
      "Connect the panels to a solar controller, and then to a DC or AC water pump.",
      "Use the free solar energy during the daytime for irrigation."
    ],
    requirements: "High initial capital (though often heavily subsidized by government)."
  },
  { 
    term: "Soil Health Testing & Cards", 
    category: "Soil & Inputs", 
    summary: "Regular lab or sensor-based soil testing to guide exactly what fertilizer a field actually needs.", 
    whyItHelps: "Stops farmers from wasting money on fertilizers their soil doesn't actually need.",
    steps: [
      "Walk your field in a zig-zag pattern, taking small soil samples from 10-15 different spots.",
      "Mix the samples together in a bucket, dry them, and put a portion in a clean bag.",
      "Take the bag to a local government or private soil testing laboratory.",
      "Receive your 'Soil Health Card' detailing N, P, K, and micronutrient levels.",
      "Apply only the specific fertilizers recommended on the card."
    ],
    requirements: "Access to a soil testing laboratory, small fee for the test."
  },
  { 
    term: "Variable Rate Technology (VRT)", 
    category: "Tech & Monitoring", 
    summary: "Equipment that automatically adjusts how much seed/fertilizer/water it applies as it moves across a field, based on that specific spot's needs.", 
    whyItHelps: "Maximizes yield by giving poor soil patches more help and rich patches less.",
    steps: [
      "Obtain a detailed map of your field's soil fertility (via grid sampling or satellite data).",
      "Load the prescription map into the computer of your VRT-enabled tractor.",
      "Attach a VRT-compatible fertilizer spreader or seed drill.",
      "Drive across the field; the computer will automatically speed up or slow down the output motor based on GPS location."
    ],
    requirements: "Highly advanced tractor, VRT implements, and detailed field data maps."
  },
  { 
    term: "Vertical Farming", 
    category: "Structures & Growing Methods", 
    summary: "Growing crops in stacked layers, often indoors, to maximize yield per square foot of land.", 
    whyItHelps: "Produces huge amounts of food in tiny urban or restricted spaces.",
    steps: [
      "Set up a climate-controlled room with excellent insulation.",
      "Install vertical racks or shelving units.",
      "Equip each shelf with LED grow lights tuned to the right light spectrum.",
      "Install a hydroponic or aeroponic system to deliver water to each level.",
      "Plant fast-growing greens like lettuce, spinach, or microgreens.",
      "Monitor the artificial climate (temp, humidity, light cycles) constantly."
    ],
    requirements: "Massive capital investment, high electricity costs, urban markets."
  },
  { 
    term: "Zero Budget Natural Farming (ZBNF)", 
    category: "Government-Backed Practices", 
    summary: "A chemical-free farming method using on-farm inputs like cow dung and urine, promoted by the Indian government to cut input costs.", 
    whyItHelps: "Frees farmers from debt by eliminating the need to buy expensive chemical fertilizers.",
    steps: [
      "Stop purchasing all synthetic fertilizers and chemical pesticides.",
      "Prepare 'Jivamrita' by fermenting cow dung, cow urine, jaggery, pulse flour, and soil in water.",
      "Apply Jivamrita to the soil regularly to stimulate microbial activity.",
      "Use mulching ('Acchadana') to cover the soil and conserve moisture.",
      "Treat seeds with 'Bijamrita' (a natural mix) before sowing to protect from diseases.",
      "Ensure soil aeration ('Waaphasa') through reduced tillage."
    ],
    requirements: "Access to indigenous cows (for dung/urine), high manual labor for preparation."
  }
];

// Helper to get an icon based on category
const getCategoryIcon = (category: string) => {
  if (category.includes("Irrigation")) return <Droplets className="h-6 w-6 text-blue-500" />;
  if (category.includes("Soil")) return <Sprout className="h-6 w-6 text-green-600" />;
  if (category.includes("Tech")) return <Cpu className="h-6 w-6 text-purple-500" />;
  if (category.includes("Structures")) return <Tractor className="h-6 w-6 text-amber-500" />;
  if (category.includes("Government")) return <Landmark className="h-6 w-6 text-red-500" />;
  return <Lightbulb className="h-6 w-6 text-yellow-500" />;
};

type ViewState = 
  | { type: 'categories' }
  | { type: 'category_list'; category: string }
  | { type: 'detail'; technique: Technique };

function ModernFarming() {
  const [view, setView] = useState<ViewState>({ type: 'categories' });

  // Compute unique categories
  const categories = useMemo(() => {
    return Array.from(new Set(MODERN_FARMING_TECHNIQUES.map(t => t.category))).sort();
  }, []);

  const handleBack = () => {
    if (view.type === 'detail') {
      setView({ type: 'category_list', category: view.technique.category });
    } else if (view.type === 'category_list') {
      setView({ type: 'categories' });
    }
  };

  // --- View: Categories ---
  if (view.type === 'categories') {
    return (
      <div className="mx-auto max-w-7xl px-4 py-6 space-y-6">

        
        <div>
          <h1 className="text-2xl font-bold">Modern Farming</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Select a category to explore modern techniques, tools, and methodologies.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {categories.map(cat => {
            const count = MODERN_FARMING_TECHNIQUES.filter(t => t.category === cat).length;
            return (
              <Card 
                key={cat} 
                className="cursor-pointer hover:shadow-lift transition-all hover:border-primary/40 group"
                onClick={() => setView({ type: 'category_list', category: cat })}
              >
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-muted/50 grid place-items-center">
                      {getCategoryIcon(cat)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{cat}</h3>
                      <p className="text-sm text-muted-foreground">{count} techniques</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  // --- View: Category List ---
  if (view.type === 'category_list') {
    const techniques = MODERN_FARMING_TECHNIQUES.filter(t => t.category === view.category).sort((a, b) => a.term.localeCompare(b.term));

    return (
      <div className="mx-auto max-w-7xl px-4 py-6 space-y-6">
        <Button onClick={handleBack} variant="ghost" size="sm" className="-ml-2 mb-1">
          <ArrowLeft className="mr-1 h-4 w-4" /> Back to Categories
        </Button>
        
        <div>
          <div className="flex items-center gap-3 mb-2">
            {getCategoryIcon(view.category)}
            <h1 className="text-2xl font-bold">{view.category}</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Choose a technique to learn how to implement it on your farm.
          </p>
        </div>

        <div className="grid gap-4 mt-6">
          {techniques.map(item => (
            <Card 
              key={item.term} 
              className="cursor-pointer hover:shadow-lift transition-all hover:border-primary/40 group"
              onClick={() => setView({ type: 'detail', technique: item })}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{item.term}</h3>
                    <p className="text-sm text-foreground/80 mt-1">{item.summary}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // --- View: Detail ---
  const tech = view.technique;
  return (
    <div className="mx-auto max-w-3xl px-4 py-6 space-y-6">
      <Button onClick={handleBack} variant="ghost" size="sm" className="-ml-2 mb-1">
        <ArrowLeft className="mr-1 h-4 w-4" /> Back to {tech.category}
      </Button>
      
      <div>
        <Badge variant="secondary" className="mb-3">{tech.category}</Badge>
        <h1 className="text-2xl sm:text-3xl font-bold">{tech.term}</h1>
        <p className="text-base text-muted-foreground mt-3 leading-relaxed">
          {tech.summary}
        </p>
      </div>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-5 flex items-start gap-3">
          <Lightbulb className="h-6 w-6 text-amber-500 shrink-0" />
          <div>
            <h4 className="font-semibold text-primary">Why it helps</h4>
            <p className="text-sm text-foreground/90 mt-1">{tech.whyItHelps}</p>
          </div>
        </CardContent>
      </Card>

      <div className="pt-4">
        <h2 className="text-xl font-bold mb-4">Steps to Implement</h2>
        <div className="space-y-4">
          {tech.steps.map((step, idx) => (
            <div key={idx} className="flex gap-3">
              <div className="h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold grid place-items-center shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <p className="text-foreground/90 text-sm sm:text-base leading-relaxed">{step}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-6 border-t mt-8">
        <h2 className="text-lg font-bold mb-3">Key Requirements</h2>
        <div className="flex items-start gap-2 bg-muted/40 rounded-lg p-4">
          <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
          <p className="text-sm text-foreground/80">{tech.requirements}</p>
        </div>
      </div>
    </div>
  );
}
