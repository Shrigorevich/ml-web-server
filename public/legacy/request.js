async function saveTemplate() {

    const isConfirmed = confirm("Are you sure?");

    if (isConfirmed) {

        const template = getTemplate();

        console.log(template);
        if (!template && !template.cells) {
            alert("Create template first");
        } else {
            try {
                const respons = await fetch("/api/templates", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        template: template.template,
                        cells: template.cells
                    })
                });
            } catch (error) {
                console.log(error);
            }
        }
    }
}

function getTemplate() {
    const templateName = localStorage.getItem("activeTemplate");
    return JSON.parse(localStorage.getItem(templateName));
}

async function createVillage() {

    const villageName = $("#village_name").val();

    if (villageName && villageName.length > 2) {
        try {
            const respons = await fetch("/api/villages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ villageName })
            });
        } catch (error) {
            alert(error.message);
        }
    } else {
        alert("Village name must be at least 3 letters long")
    }
}

async function applyTemplate() {

    const villageName = $("#village_dropdown").val();
    const templateName = $("#template_dropdown").val();

    const template = JSON.parse(localStorage.getItem(templateName));

    if (villageName && template) {
        try {
            const response = await fetch("/api/villages", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ template, villageName })
            });

            alert("Template applied successfully");
        } catch (error) {
            alert("Something went wrong");
        }
    } else {
        alert("Bad values");
    }
}