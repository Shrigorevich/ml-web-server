async function saveTemplate() {

    const isConfirmed = confirm("Are you sure?");

    if (isConfirmed) {
        const cells = getCells();
        const template = getTemplate();

        console.log(cells);
        console.log(template);
        if(!template) {
            alert("Create template first");
        } else if (!cells) {
            alert("Set cells first")
        } else {
            try {
                const respons = await fetch("/api/templates", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ cells, template })
                });
            } catch (error) {
                console.log(error);
            }
        }
    }
}

function getCells() {
    return JSON.parse(localStorage.getItem("cells"));
}

function getTemplate() {
    return JSON.parse(localStorage.getItem("template"));
}