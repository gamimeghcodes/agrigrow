import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MapPin, Search, Loader2, AlertCircle, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { API_BASE_URL } from "@/lib/api";

export const Route = createFileRoute("/farmer/market-price")({
  component: MarketPricePage,
});

interface MarketRecord {
  state: string;
  district: string;
  market: string;
  commodity: string;
  min_price: string | number;
  max_price: string | number;
  modal_price: string | number;
  arrival_date: string;
}

const INDIAN_STATES = [
  "Andaman and Nicobar", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh",
  "Chhattisgarh", "Dadra and Nagar Haveli", "Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

function MarketPricePage() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  
  // Data state
  const [allStateData, setAllStateData] = useState<MarketRecord[]>([]);
  const [isMock, setIsMock] = useState(false);
  
  // Selection state
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedMarket, setSelectedMarket] = useState<string>("");

  const handleStateChange = async (state: string) => {
    setSelectedState(state);
    setSelectedDistrict("");
    setSelectedMarket("");
    setAllStateData([]);
    setIsMock(false);
    
    if (!state) return;
    
    setLoading(true);
    setErrorMsg("");
    
    try {
      const apiKey = import.meta.env.VITE_DATA_GOV_API_KEY;
      if (apiKey && apiKey.trim() !== "") {
        const url = `${API_BASE_URL}/market-prices/fetch/?state=${encodeURIComponent(state)}`;
        
        const dataRes = await fetch(url);
        if (!dataRes.ok) throw new Error("Failed to fetch market data from the server");
        const dataJson = await dataRes.json();
        
        if (dataJson.records && dataJson.records.length > 0) {
          setAllStateData(dataJson.records);
        } else {
          setErrorMsg(`No recent market data found for ${state}.`);
        }
      } else {
        // Mock data fallback — only shown when VITE_DATA_GOV_API_KEY isn't set.
        // Clearly flagged via isMock so the UI never passes it off as live data.
        await new Promise(r => setTimeout(r, 600));
        const mockRecords: MarketRecord[] = [
          { state, district: "Pune", market: "Pune APMC", commodity: "Tomato", min_price: 1500, max_price: 2200, modal_price: 1800, arrival_date: new Date().toLocaleDateString('en-GB') },
          { state, district: "Pune", market: "Pune APMC", commodity: "Onion", min_price: 1200, max_price: 1600, modal_price: 1400, arrival_date: new Date().toLocaleDateString('en-GB') },
          { state, district: "Pune", market: "Baramati Market", commodity: "Potato", min_price: 1800, max_price: 2400, modal_price: 2100, arrival_date: new Date().toLocaleDateString('en-GB') },
          { state, district: "Nashik", market: "Nashik Market", commodity: "Wheat", min_price: 2100, max_price: 2300, modal_price: 2250, arrival_date: new Date().toLocaleDateString('en-GB') },
          { state, district: "Nashik", market: "Lasalgaon APMC", commodity: "Onion", min_price: 1100, max_price: 1800, modal_price: 1500, arrival_date: new Date().toLocaleDateString('en-GB') },
        ];
        setAllStateData(mockRecords);
        setIsMock(true);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  const handleGetLocation = () => {
    setLoading(true);
    setErrorMsg("");
    
    if (!navigator.geolocation) {
      setErrorMsg("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const geoRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          if (!geoRes.ok) throw new Error("Failed to fetch location data");
          const geoData = await geoRes.json();
          
          let state = geoData.address?.state || "Maharashtra";
          let district = geoData.address?.state_district || geoData.address?.county || "Pune";
          district = district.replace(/ District/i, "").trim();
          
          // Trigger fetch for this state
          await handleStateChange(state);
          setSelectedDistrict(district);
        } catch (err: any) {
          setErrorMsg(err.message || "An error occurred while finding location.");
          setLoading(false);
        }
      },
      (error) => {
        setErrorMsg("Unable to retrieve your location. Please ensure location permissions are granted.");
        setLoading(false);
      }
    );
  };

  // Compute derived state for dropdowns
  const availableDistricts = useMemo(() => {
    const districts = new Set(allStateData.map(r => r.district));
    return Array.from(districts).sort();
  }, [allStateData]);

  const availableMarkets = useMemo(() => {
    if (!selectedDistrict) return [];
    const markets = new Set(allStateData.filter(r => r.district === selectedDistrict).map(r => r.market));
    return Array.from(markets).sort();
  }, [allStateData, selectedDistrict]);

  // Compute final table data
  const displayedData = useMemo(() => {
    let data = allStateData;
    if (selectedDistrict) {
      data = data.filter(r => r.district === selectedDistrict);
    }
    if (selectedMarket) {
      data = data.filter(r => r.market === selectedMarket);
    }
    
    // Sort alphabetically by commodity as requested
    return [...data].sort((a, b) => a.commodity.localeCompare(b.commodity));
  }, [allStateData, selectedDistrict, selectedMarket]);

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Market Prices (Mandi)</h1>
          <p className="text-muted-foreground mt-1">
            Select your market or find nearest to check real-time wholesale crop prices.
          </p>
        </div>
        <Button onClick={handleGetLocation} disabled={loading} variant="outline" className="gap-2">
          {loading && !selectedState ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
          Auto-Detect Location
        </Button>
      </div>

      {isMock ? (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-md p-4 text-sm text-amber-700 dark:text-amber-400 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p>
            <strong>Estimated data:</strong> No <code>VITE_DATA_GOV_API_KEY</code> is configured, so the
            prices below are representative sample values, not live mandi prices. Add a free API key
            from data.gov.in to your frontend <code>.env</code> to see real-time Agmarknet data.
          </p>
        </div>
      ) : (
        <div className="bg-primary/10 border border-primary/20 rounded-md p-4 text-sm text-primary/90 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p>
            <strong>Disclaimer:</strong> Prices are fetched directly from live government mandis via Agmarknet. 
            Only markets that have actively reported their prices today will appear in the dropdowns. 
            If your local APMC is missing, they have not uploaded data for today yet.
          </p>
        </div>
      )}

      <Card>
        <CardHeader className="pb-3 border-b mb-4">
          <div className="flex items-center gap-2 text-primary font-medium">
            <Filter className="w-4 h-4" />
            <h2>Filter Market Data</h2>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>State</Label>
              <Select value={selectedState} onValueChange={handleStateChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  {INDIAN_STATES.map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>District</Label>
              <Select 
                value={selectedDistrict} 
                onValueChange={(val) => { setSelectedDistrict(val); setSelectedMarket(""); }}
                disabled={!selectedState || availableDistricts.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select District" />
                </SelectTrigger>
                <SelectContent>
                  {availableDistricts.map(d => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Market (APMC)</Label>
              <Select 
                value={selectedMarket} 
                onValueChange={setSelectedMarket}
                disabled={!selectedDistrict || availableMarkets.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Market" />
                </SelectTrigger>
                <SelectContent>
                  {availableMarkets.map(m => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {errorMsg && (
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="flex items-center gap-2 p-4 text-destructive">
            <AlertCircle className="w-5 h-5" />
            <p>{errorMsg}</p>
          </CardContent>
        </Card>
      )}

      {loading && selectedState && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {!loading && displayedData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{isMock ? "Estimated Market Rates" : "Today's Market Rates"}</CardTitle>
            <CardDescription>
              Prices are in ₹ per Quintal (100 kg) - Sorted Alphabetically
              {isMock && " · sample data, not live"}
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Commodity</TableHead>
                  <TableHead>Market</TableHead>
                  <TableHead>District</TableHead>
                  <TableHead className="text-right">Min Price</TableHead>
                  <TableHead className="text-right">Max Price</TableHead>
                  <TableHead className="text-right font-bold text-primary">Modal Price</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedData.map((record, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{record.commodity}</TableCell>
                    <TableCell>{record.market}</TableCell>
                    <TableCell className="text-muted-foreground">{record.district}</TableCell>
                    <TableCell className="text-right text-muted-foreground">₹{record.min_price}</TableCell>
                    <TableCell className="text-right text-muted-foreground">₹{record.max_price}</TableCell>
                    <TableCell className="text-right font-bold text-primary">₹{record.modal_price}</TableCell>
                    <TableCell className="text-right text-muted-foreground text-sm">{record.arrival_date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {!loading && allStateData.length === 0 && !errorMsg && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
            <Search className="w-12 h-12 mb-4 opacity-20" />
            <p>Select a State, District, and Market to view prices.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
