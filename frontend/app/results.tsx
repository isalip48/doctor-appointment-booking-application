import WebResultsScreen from "./results.web";
import NativeResultsScreen from "./results.native";
import { PLATFORM } from "@/utils/platform";

export default PLATFORM.ISWEB ? WebResultsScreen : NativeResultsScreen;