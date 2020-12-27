import "./App.css";
import axios from "axios";
import _ from "lodash";
import { useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom";
import React, { useState, useEffect } from "react";

function App() {
    const [items, setitems] = useState([]);
    const [value, setValue] = useState("");
    const location = useLocation();
    const history = useHistory();

    async function Search(location) {
            const name = location.search.replace("?", "");
            const res = await axios("http://localhost:3000/search/" + name);
            const sortedResult = _.sortBy(res.data, [(o) => o.file]);
            const searchResults = sortedResult.map((i) => {
                return (
                    <div
                        onClick={() =>
                            history.push("/logs/" + i.file + "#" + i.line)
                        }
                    >
                        20{i.file.substring(8, 16)}{" "}
                        <div style={{ color: "white", display: "inline" }}>
                            {" "}
                            {i.match}{" "}
                        </div>
                        <br />
                        <br />
                    </div>
                );
            });
            setitems(searchResults);
    }

    useEffect(() => {
        Search(location);
    }, [location]);

    async function handleKeyDown(e) {
        if (e.key === "Enter") {
            history.push("/?" + value)
        }
    }

    return (
        <div className="Center">
            <br />
            <h1>Haskell IRC Log Search</h1>
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
