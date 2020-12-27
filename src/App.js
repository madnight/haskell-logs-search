import "./App.css";
import axios from "axios";
import _ from "lodash";

import { useHistory } from "react-router-dom";
import React, { useState } from "react";

function App() {
    const [items, setitems] = useState([]);
    const [value, setValue] = useState("");
    const history = useHistory();

    async function handleKeyDown(e) {
        if (e.key === "Enter") {
            const res = await axios("http://localhost:3000/search/" + value);
            console.log(res.data);
            console.log(value);

            const d = _.sortBy(res.data, [ (o) => o.file, ]);
            const arr = [];
            for (const [index, value] of d.entries()) {
                console.log(index, value);
                arr.push(
                    <div
                        onClick={() =>
                            history.push(
                                "/logs/" + value.file + "#" + value.line
                            )
                        }
                    >
                        20{value.file.substring(8, 16)} {value.match}
                        <br />
                        <br />
                    </div>
                );
            }
            setitems(arr);
        }
    }

    return (
        <div className="Center">
            <br />
            <input
                style={{ height: 30, fontSize: 17 }}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <br />
            <br />
            <div className="App">{items}</div>
        </div>
    );
}

export default App;
