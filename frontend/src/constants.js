export const userData = {
    userName: "admin",
    password: "admin",
};
export const backurl = "http://localhost:8000"
export function ssum( obj ) {
    var sum = 0;
    for( var el in obj ) {
      if( obj.hasOwnProperty( el ) ) {
        sum += parseFloat( obj[el]["Monthly Net"] );
      }
    }
    return sum;
  }

export const columnData = {
    "Weekly Net": 0,
    "Bi-Weekly Net": 0,
    "Monthly Net": 0,
    "Yearly Net": 0,    
};

export const multiplication = {
    0:7/30,
    1: 14/30,
    2: 1,
    3: 365/30,
};

export const backgroundHighlights = ["income", "expenses", "Mortgage"];

export const budgetData = {
    title: "",
    "Monthly Mortage Payments": {
        "1 Rowntree Road, Apt# 1008,Toronto, Ontario, M9V5G7 ": { "": 1494.3 },
        "134 York Street Apt#805 Ottawa, Ontario, K1N 1K8 ": { "": 975.28 },
        Halifax: { "": 1776.17 },

        "Total Income Available": {
            ...columnData,
        },
    },
    "Monthly Property Tax": {
        "1 Rowntree Road, Apt# 1008,Toronto, Ontario, M9V5G7 ": { "": 1234.25 },
        "134 York Street Apt#805 Ottawa, Ontario, K1N 1K8 ": { "": 211.53 },
        Halifax: { "": 208.33 },

        "Total Expenditures": {
            ...columnData,
        },
    },
};
export const isauth = async (userName, password) => {
    let authString = `${userName}:${password}`
    let headers = new Headers();
    headers.set('Authorization', 'Basic ' + btoa(authString))
    await fetch(backurl+`/auth/`, { method: 'GET', headers: headers })
        .then(data => data.json())
        .then(data => (data && data['user']))
}

export function setToPosition(obj, replaceWith) {
    let keyValues = Object.entries(obj);
    keyValues.splice(keyValues.length - 1, 0, [replaceWith, { columnData }]);
    return Object.fromEntries(keyValues);
}

export function roundTo(num) {
    return Math.round(num * 100) / 100;
}

export async function insert(budget, category, row, value, funct) {
    if (row == null) {
        if (category != null) {
            if (budget != null) {
                const rawResponse = await fetch(backurl+`/categories/`, {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ text: category, budget_id: budget }),
                }).then(funct)
            } else {
                const rawResponse = await fetch(backurl+`/budgets/`, {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        'Authorization':'Basic ' + btoa(category)
                    },
                    body: JSON.stringify({title:value}),
                }).then(funct)

            }


        } else {
            if (value != null) {
                if(budget != null ){
                    let method=budget[0]
                    let id=budget[1]
                    let data=budget[2]
                    const rawResponse = await fetch(backurl+`/budgets/${id}/`, {
                    method: method,
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        'Authorization':'Basic ' + btoa(value)
                    },
                    body: JSON.stringify(data),
                }).then(funct)

                }else{
                const rawResponse = await fetch(backurl+`/rows/${value}/`, {
                    method: "DELETE"
                }).then(funct)


            }} else {
                const rawResponse = await fetch(backurl+`/categories/${budget}/`, {
                    method: "DELETE"
                }).then(funct)


            }
        }
    } else {
        if (value == null) {
            const rawResponse = await fetch(backurl+`/rows/`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ budget_id: budget, text: row, category_id: category, value: 0 }),
            }).then(funct)


        } else {
            {
                const rawResponse = await fetch(backurl+`/rows/${row}/`, {
                    method: "PATCH",

                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ value: value }),
                }).then(funct)


            }
        }
    }
    console.log('a')

}
