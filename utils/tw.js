import { create } from "twrnc";

// Create the customized version...
const tw = create(require("../tailwind.config.js"));

// ... and then this becomes the main function your app uses
export default tw;
