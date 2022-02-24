import React, { useEffect, useState } from "react";
import { reactLocalStorage } from "reactjs-localstorage";
import {
    BsFillPlusCircleFill,
    BsTrash,
    BsPencil,
    BsFolderCheck,
} from "react-icons/bs";
import {
    backurl,
    budgetData,
    columnData,
    multiplication,
    titleColors,
    setToPosition,
    backgroundHighlights,
    roundTo,
    insert,
    ssum,
} from "../../constants";
import highcharts3d from "highcharts/highcharts-3d";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";

highcharts3d(Highcharts);
Highcharts.setOptions({
    colors: [
        "#FFEA5D",
        "#97EE5B",
        "#5B8CFB",
        "#ED6559",
        "#B067FD",
        "#F5AE5E",
        "#5E5BF2",
        "#CC51A8",
    ],
});

function Budget() {
    const [data, setData] = useState([]);
    const [chartData, setChartData] = useState({});
    const [message, setMessage] = useState("");
    const [index, setIndex] = useState(0);
    const [isOpen, setOpen] = useState(false);

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        getChartData();
    }, [data]);

    const getData = async () => {
        const authString = reactLocalStorage.get("credentials");
        console.log("ee");
        console.log(authString);
        let headers = new Headers();
        headers.set("Authorization", "Basic " + btoa(authString));
        const res = await fetch(`${backurl}/budgets/`, {
            method: "GET",
            headers: headers,
        });
        const result = await res.json();

        var budgets = [];
        var bs;
        if (result && result.length) {
            for (bs = 0; bs < result.length; bs++) {
                var expenses = {}
                var investments = {}

                var b, e, i, c, a, i, j
                b = {};
                b["title"] = result[bs]["title"];
                b["budget_id"] = result[bs]["id"];
                b["chart_title"] = result[bs]["chart_title"];
                b["chart_text"] = result[bs]["chart_text"];
                e = [...result[bs]["categories"]];
                var sum = 0;
                if (undefined !== e && e.length) {
                    for (i = 0; i < e.length; i++) {
                        


                        c = {};
                        a = [...result[bs]["categories"][i]["rows"]];
                        var csum = 0

                        for (j = 0; j < a.length; j++) {
                            c[result[bs]["categories"][i]["rows"][j]["text"]] = {
                                "Monthly Net": result[bs]["categories"][i]["rows"][j]["value"],
                                row_id: result[bs]["categories"][i]["rows"][j]["id"],
                                "Bi-Weekly Net": 0,
                                "Weekly Net": 0,
                                "Yearly Net": 0,
                            };
                            csum = +csum + +(result[bs]["categories"][i]["rows"][j]["value"] || 0)
                            console.log('csum')
                            console.log(csum)
                        }
                        sum = +sum + +csum
                        var key = result[bs]["categories"][i]["text"];

                        if (key.includes("investement")) {
                            investments[key] = {
                                "Monthly Net": csum,
                                "row_id": i,
                                "Bi-Weekly Net": 0,
                                "Weekly Net": 0,
                                "Yearly Net": 0,
                            }


                        } else {
                            expenses[key] = {
                                "Monthly Net": csum,
                                "row_id": i,
                                "Bi-Weekly Net": 0,
                                "Weekly Net": 0,
                                "Yearly Net": 0,
                            }
                        }


                        c["category_id"] = result[bs]["categories"][i]["id"];

                        c["Total"] = { "Monthly Net": csum };


                        b[key] = { ...c };
                        b["Expenses"] = { ...expenses }
                        b["Investements"] = { ...investments }


                    }


                }

                if (Object.keys(b).length) {
                    console.log('inv')
                    console.log(ssum(investments))
                    console.log(sum)
                    console.log((b['income'] && (b["income"]["Total"]["Monthly Net"] || 0) || 0) )

                    if (Object.keys(investments).length) { b["Investements"] = { ...investments, "Total investemnts":{ "Monthly Net":ssum(investments) }}}
                    if(b["Expenses"]){b["Expenses"]["Investements"]=(b["Investements"]&&(b["Investements"]["Total investemnts"]||0)||0) 
                    b["Expenses"]["Total Expenditures"] = { "Monthly Net": sum-(b['income'] && (b["income"]["Total"]["Monthly Net"] || 0) || 0)  }
                    b["Expenses"]["Surplus / Deficit"] = { "Monthly Net":2*(b['income'] && (b["income"]["Total"]["Monthly Net"] || 0) || 0)-sum}
                }}
                console.log("b");
                console.log(b);
                budgets.push(b);


            }

            if (!(budgets && (budgets.length || Object.keys(budgets).length))) {
                reactLocalStorage.setObject("budgets", budgets);
                setData(budgets);
            } else {
                setData(budgets);
            }
        }
    };

    const addBudget = () => {
        const authString = reactLocalStorage.get("credentials");
        const _budgets = reactLocalStorage.getObject("budgets");
        const title = `budget ${_budgets.length}`;
        insert(null, authString, null, title, getData);
        showMessage("Budget successfully added!");
    };

    const deleteBudget = (e) => {
        if (window.confirm("Are you sure you want to delete this budget?")) {
            const authString = reactLocalStorage.get("credentials");
            insert(e, null, null, authString, getData);
            showMessage("Budget successfully deleted!");
        }
    };
    const editBudget = (method,id,value,) => {
        if(method === "DELETE"){window.confirm("Are you sure you want to delete this budget?")}
            const authString = reactLocalStorage.get("credentials");
            let d=[method,id,value]
            insert(d, null, null, authString, getData);
            
            if(method === "DELETE"){showMessage("Budget successfully deleted!");}
        
    };

    const saveBudget = () => {
        reactLocalStorage.setObject("budgets", data);
        showMessage("Budget successfully saved!");
        getData();
    };

    const showMessage = (msg) => {
        setMessage(msg);
        setTimeout(() => {
            setMessage("");
        }, 3000);
    };

    const getTotal = (item, tab, column, index) => {
        let sum = 0;
        Object.keys(item[tab]).map((colTab) => {
            if (index > 0) {
                sum =
                    sum +
                    (parseFloat(item[tab][colTab]["Monthly Net"]) || 0) *
                    multiplication[index];
            } else {
                sum = sum + (parseFloat(item[tab][colTab][column]) || 0);
            }
        });
        return roundTo(sum/2);
    };

    const getChartData = () => {
        if (data && data.length) {
            data.forEach((item, i) => {
                let chart = [];
                if (item && Object.keys(item)) {
                    Object.keys(item).map((tab) => {
                        if (item[tab] && Object.keys(item[tab]) && (tab !== "Expenses")&& (tab !== "income")&& (tab !== "income")&&(!tab.includes('investement'))||(tab==="Investements")) {
                            let sum = 0;

                            Object.keys(item[tab]).map((colTab) => {
                                sum = sum + (parseFloat(item[tab][colTab]["Monthly Net"]) || 0);
                            });

                            let insert = {
                                label: `<span style='font-size: 1.2rem; font-weight: 50; fill: #fff'; text-align: center>${tab} <span style='fill: #6AD7BB;'>$${sum}</span> </span>`,
                                value: sum,
                            };
                            if (sum) {
                                chart.push(insert);
                            }
                        }
                    });
                }
                setChartData((prev) => {
                    return {
                        ...prev,
                        [`Budget ${i + 1}`]: [...chart],
                    };
                });
            });
        }
    };

    const toggleOpen = () => setOpen(!isOpen);

    const menuClass = `dropdown-menu${isOpen ? " show" : ""}`;

    return (
        <div className="container text-left mt-4">
            {message && <div className="alert alert-success m-4">{message}</div>}
            <div className="row budget-bar text-white">
                <div className="col margin-title">
                    <p className="title">Budget</p>
                </div>
                <div className="col mt-4">
                    <select
                        onChange={(e) => {
                            setIndex(e.target.value);
                        }}
                        className="form-control form-control-sm"
                    >
                        {data &&
                            data.length &&
                            data.map((item, i) => (
                                <option key={i} value={i}>
                                    {`budget ${i + 1}`}
                                </option>
                            ))}
                    </select>
                </div>
                <div className="col mb-4">
                    <button
                        onClick={addBudget}
                        className="btn btn-actions"
                        style={{ width: 175 }}
                    >
                        <BsFillPlusCircleFill className="icon-style" />
                        Add a budget
                    </button>
                </div>
                <div className="col mb-4">
                    <div onClick={toggleOpen} className="dropdown">
                        <button
                            className="btn btn-actions dropdown-toggle"
                            type="button"
                            id="dropdownMenuButton"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                        >
                            <BsTrash className="icon-style" />
                            Delete
                        </button>
                        <div className={menuClass} aria-labelledby="dropdownMenuButton">
                            {data &&
                                data.length &&
                                data.map((item, i) => (
                                    <a
                                        style={{ cursor: "pointer" }}
                                        className="dropdown-item"
                                        onClick={() =>{
                                            let id=data[i]["budget_id"]
                                            let method="DELETE"

                                            
                                            editBudget(method,id,null)}}
                                        key={"id"}
                                        value={data[i]["budget_id"]}
                                    >
                                        {`budget ${i + 1}`}
                                    </a>
                                ))}
                        </div>
                    </div>
                </div>
                <div className="col mb-4">
                    <button onClick={saveBudget} className="btn btn-actions">
                        <BsFolderCheck className="icon-style" />
                        Save
                    </button>
                </div>
            </div>
            <div
                className="mt-3 mb-3 row"
                style={{ width: `${1200 * data.length}px` }}
            >
                {data &&
                    data.length &&
                    data.map((item, i) => (
                        <div className="col bordered-budget mr-2">
                            <div key={i}>
                                {chartData && chartData[`Budget ${i + 1}`] ? (
                                    <>
                                        <div class="input-group">
                                            
                                            <div class="input-group-prepend">
                                                <span class="input-group-text" id="">Budget title</span>
                                            </div>
                                            <input type="text" class="form-control" 
                                            value={data[i].title}
                                            onChange={(e) => {
                                                const _data = [...data];
                                                _data[i]["title"] = e.target.value;
                                                setData(_data);
                                            }}
                                            onBlur={(e) => {
                                                let id=data[i].budget_id
                                                let value={'title':data[i].title}
                                                editBudget("PATCH",id,value)
                                            }}
                                            placeholder="Enter Budget Name"/>
                                            <div class="input-group-prepend">
                                                <span class="input-group-text" id="">Chart title</span>
                                            </div>
                                            <input type="text" class="form-control"
                                              value={data[i].chart_title}
                                              onChange={(e) => {
                                                const _data = [...data];
                                                _data[i]["chart_title"] = e.target.value;
                                                setData(_data);
                                            }}
                                            onBlur={(e) => {
                                                let id=data[i].budget_id
                                                let value={'chart_title':data[i].chart_title}
                                                editBudget("PATCH",id,value)
                                            }}
                                              placeholder="Enter  chart title" />
                                            <div class="input-group-prepend">
                                                <span class="input-group-text" id="">Chart Text</span>
                                            </div>
                                            <input type="text" class="form-control"
                                              value={data[i].chart_text}
                                              onChange={(e) => {
                                                const _data = [...data];
                                                _data[i]["chart_text"] = e.target.value;
                                                setData(_data);
                                            }}
                                            onBlur={(e) => {
                                                let id=data[i].budget_id
                                                let value={'chart_text':data[i].chart_text}
                                                editBudget("PATCH",id,value)
                                            }}
                                              placeholder="Enter chart text" />
                                        </div> 
                    
                                        <div className="chart-background">
                                            <HighchartsReact
                                                highcharts={Highcharts}
                                                options={{
                                                    title: {
                                                        text: `<span style='fill: #fff; font-size: 1.2rem; font-weight: 600;'> ${data[i].chart_text}<br> <span style='fill: #6AD7BB; font-size: 1.6rem; font-weight: 1000;'></span> </span>`,
                                                        align: "center",
                                                        verticalAlign: "middle",
                                                        y: 55,
                                                    },
                                                    subtitle: {
                                                        text: data[i].chart_title,
                                                        style: {
                                                            color: "#fff",
                                                            fontSize: "2.4rem",
                                                            fontWeight: "bolder",
                                                        },
                                                    },
                                                    chart: {
                                                        type: "pie",
                                                        backgroundColor: undefined,
                                                        options3d: {
                                                            enabled: true,
                                                            alpha: 18,
                                                            beta: 0,
                                                        },
                                                        height: 750,
                                                    },
                                                    plotOptions: {
                                                        pie: {
                                                            innerSize: 250,
                                                            depth: 114,
                                                            size: 450,
                                                            startAngle: -65,
                                                        },
                                                        series: {
                                                            dataLabels: {
                                                                enabled: true,
                                                                color: "red",
                                                            },
                                                        },
                                                    },
                                                    series: [
                                                        {
                                                            type: "pie",
                                                            data: [
                                                                ...chartData[`Budget ${i + 1}`].map((s) => [
                                                                    s.label,
                                                                    s.value,
                                                                ]),
                                                            ],
                                                        },
                                                    ],
                                                }}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    ""
                                )}

                                {item &&
                                    Object.keys(item).length &&
                                    Object.keys(item).map((tab, tabNumber) => (
                                        <>
                                            {!(tab === "title" || tab === "budget_id" || tab === "chart_title" || tab === "chart_text") ? (
                                                <>
                                                    <table className="table table-bordered  mt-4">
                                                        <thead>
                                                            <tr>
                                                                <th
                                                                    className="title-column default-background"
                                                                    scope="col"
                                                                >
                                                                    {!tab ? (
                                                                        <input
                                                                            onBlur={(e) => {
                                                                                const _data = [...data];
                                                                                Object.defineProperty(
                                                                                    _data[i],
                                                                                    e.target.value,
                                                                                    Object.getOwnPropertyDescriptor(
                                                                                        _data[i],
                                                                                        ""
                                                                                    )
                                                                                );
                                                                                console.log("i");
                                                                                console.log(data[i]["budget_id"]);
                                                                                console.log(data);

                                                                                delete _data[i][""];
                                                                                insert(
                                                                                    data[i]["budget_id"],
                                                                                    e.target.value,
                                                                                    null,
                                                                                    null,
                                                                                    getData
                                                                                );
                                                                            }}
                                                                            className="form-control form-control-sm"
                                                                            type="text"
                                                                        />
                                                                    ) : (
                                                                        tab
                                                                    )}
                                                                </th>
                                                                {columnData &&
                                                                    Object.keys(columnData) &&
                                                                    Object.keys(columnData).length &&
                                                                    Object.keys(columnData).map(
                                                                        (column, columnIndex) => (
                                                                            <th
                                                                                className=" default-background"
                                                                                scope="col"
                                                                            >
                                                                                {column}
                                                                            </th>
                                                                        )
                                                                    )}
                                                                <th
                                                                    className="  default-background"
                                                                    gg="f"
                                                                    onClick={() => {
                                                                        const _data = [...data];
                                                                        insert(
                                                                            data[i][tab]["category_id"],
                                                                            null,
                                                                            null,
                                                                            null,
                                                                            getData
                                                                        );

                                                                        delete _data[i][tab];
                                                                    }}
                                                                    scope="col"
                                                                    style={{ cursor: "pointer" }}
                                                                    scope="col"
                                                                >
                                                                    <BsTrash className="icon-style" />
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {item[tab] &&
                                                                Object.keys(item[tab]) &&
                                                                Object.keys(item[tab]).length &&
                                                                Object.keys(item[tab])
                                                                    .filter((ele) => {
                                                                        return !(ele === "category_id");
                                                                    })
                                                                    .map((tabData) => (
                                                                        <tr>
                                                                            {!tabData ? (
                                                                                <td className=" align-left" scope="col">
                                                                                    <input
                                                                                        onBlur={(e) => {
                                                                                            const _data = [...data];
                                                                                            delete _data[i][tab][""];
                                                                                            _data[i][tab] = setToPosition(
                                                                                                _data[i][tab],
                                                                                                e.target.value
                                                                                            );
                                                                                            insert(
                                                                                                data[i]["budget_id"],
                                                                                                data[i][tab]["category_id"],
                                                                                                e.target.value,
                                                                                                null,
                                                                                                getData
                                                                                            );
                                                                                        }}
                                                                                        className="form-control form-control-sm"
                                                                                        type="text"
                                                                                    />
                                                                                </td>
                                                                            ) : (
                                                                                <th
                                                                                    className="title-column align-left"
                                                                                    scope="col"
                                                                                    f="f"
                                                                                >
                                                                                    {tabData}
                                                                                </th>
                                                                            )}

                                                                            {columnData &&
                                                                                Object.keys(columnData) &&
                                                                                Object.keys(columnData).length &&
                                                                                Object.keys(columnData).map(
                                                                                    (column, index) => (
                                                                                        <>
                                                                                            {(index === 2 &&
                                                                                                !tabData.includes("Total")) ||
                                                                                                column === "Notes" ? (
                                                                                                <td
                                                                                                    class="weekly-width align-center"
                                                                                                    scope="col"
                                                                                                >
                                                                                                    <input 
                                                                                                        onChange={(e) => {
                                                                                                            const _data = [...data];
                                                                                                            _data[i][tab][tabData][
                                                                                                                column
                                                                                                            ] = e.target.value;
                                                                                                            setData(_data);
                                                                                                        }}
                                                                                                        onBlur={(e) => {
                                                                                                            insert(
                                                                                                                1,
                                                                                                                data[i][tab][
                                                                                                                "category_id"
                                                                                                                ],
                                                                                                                data[i][tab][tabData][
                                                                                                                "row_id"
                                                                                                                ],
                                                                                                                e.target.value,
                                                                                                                getData
                                                                                                            );
                                                                                                        }}
                                                                                                        value={
                                                                                                            data[i][tab][tabData][
                                                                                                            column
                                                                                                            ]
                                                                                                        }
                                                                                                        class="weekly-width form-control form-control-sm"
                                                                                                        type={`${column === "Notes"
                                                                                                            ? "text"
                                                                                                            : "number"
                                                                                                            }`}
                                                                                                    />
                                                                                                </td>
                                                                                            ) : (tabData.includes("Total") && !(tabData =="Total Expenditures")&&!(tabData =="Total investemnts"))? (
                                                                                                <td  class="weekly-width" scope="col">
                                                                                                    $
                                                                                                    {getTotal(
                                                                                                        item,
                                                                                                        tab,
                                                                                                        column,
                                                                                                        index
                                                                                                    )}
                                                                                                </td>
                                                                                            ) : (
                                                                                                <td  class="weekly-width" scope="col">
                                                                                                    $
                                                                                                    {roundTo(
                                                                                                        (data[i][tab][tabData][
                                                                                                            "Monthly Net"
                                                                                                        ] || 0) *
                                                                                                        multiplication[index]
                                                                                                    )}
                                                                                                </td>
                                                                                            )}
                                                                                        </>
                                                                                    )
                                                                                )}
                                                                            {!tabData.includes("Total") ? (
                                                                                <td  class="icon-style"
                                                                                    onClick={() => {
                                                                                        const _data = [...data];
                                                                                        insert(
                                                                                            null,
                                                                                            null,
                                                                                            null,
                                                                                            data[i][tab][tabData]["row_id"],
                                                                                            getData
                                                                                        );

                                                                                        delete _data[i][tab][tabData];
                                                                                    }}
                                                                                    style={{ cursor: "pointer" }}
                                                                                    scope="col"
                                                                                >
                                                                                    <BsTrash className="icon-style" />
                                                                                </td>
                                                                            ) : (
                                                                                <td class="weekly-width"  scope="col"></td>
                                                                            )}
                                                                        </tr>
                                                                    ))}
                                                        </tbody>
                                                    </table>

                                                    <button
                                                        onClick={() => {
                                                            const _data = [...data];
                                                            _data[i][tab] = setToPosition(_data[i][tab], "");
                                                            setData(_data);
                                                        }}
                                                        className="btn btn-success row-add"
                                                    >
                                                        <BsFillPlusCircleFill className="icon-style" /> Row
                                                    </button>
                                                </>
                                            ) : (
                                                ""
                                            )}
                                        </>
                                    ))}
                            </div>

                            <button
                                onClick={() => {
                                    const _data = [...data];
                                    _data[i] = { ..._data[i], "": "" };
                                    setData(_data);
                                }}
                                className="btn margin-right btn-success row-add"
                            >
                                <BsFillPlusCircleFill className="icon-style" /> Category
                            </button>
                        </div>
                    ))}
            </div>
        </div>
    );
}

export default Budget;
