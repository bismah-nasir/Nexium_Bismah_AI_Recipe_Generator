import { Composition, Still } from "remotion";
import { Demo, FPS, TOTAL_FRAMES } from "./Demo";
import { Poster } from "./poster/Poster";

export const Root = () => (
    <>
        <Composition
            id="RecipeGenDemo"
            component={Demo}
            durationInFrames={TOTAL_FRAMES}
            fps={FPS}
            width={1920}
            height={1080}
        />
        <Still id="RecipeGenPoster" component={Poster} width={1920} height={1080} />
    </>
);
