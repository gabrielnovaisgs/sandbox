import { Controller } from "./controller";
import { Counter } from "./counter";
import { Level } from "./level";

export function Box() {
    return (
        <div className="text-black">
            <Level>
                <p>Level 1</p>
                <Level>
                    <p>Level 2</p>
                    <Level>
                        <p>Level 3</p>
                        <Counter />
                    </Level>
                    <Level>
                        <p>Level 3</p>
                        <Level>
                            <p>Level 4</p>
                            <Controller />
                        </Level>

                    </Level>
                </Level>
            </Level>
        </div>
    )
}