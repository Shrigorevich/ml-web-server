
async function fetchTemplates() {
    try {
        const response = await fetch("/api/templates", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();
        if (data.templates && data.templates.length > 0) {

            data.templates.forEach((template) => {

                const cells = data.cells.filter((cell) => cell.templateName === template.name);
                const templateToSave = { instance: template, cells };
                localStorage.setItem(template.name, JSON.stringify(templateToSave));
            })
        }

        let dropDownOptions = $("#existing_templates").html();
        data.templates.forEach(template => {
            dropDownOptions += `<option>${template.name}</option>`
        });

        $("#existing_templates").html(dropDownOptions);
        $("#template_dropdown").html(dropDownOptions);

    } catch (error) {
        console.log(error);
    }
}

async function fetchVillages() {

    const response = await fetch("/api/villages", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const data = await response.json();

    let dropDownOptions = $("#village_dropdown").html();
    data.villages.forEach(village => {
        dropDownOptions += `<option>${village.name}</option>`
    });

    $("#village_dropdown").html(dropDownOptions);

    localStorage.setItem("villages", JSON.stringify(data.villages));
}

async function saveTemplate() {

    const isConfirmed = confirm("Are you sure?");

    if (isConfirmed) {

        const template = getTemplate();

        console.log(template);
        if (!template && !template.cells) {
            alert("Create template first");
        } else {
            try {
                await fetch("/api/templates", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        template: template.instance,
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

    const villages = JSON.parse(localStorage.getItem("villages"));
    const village = villages.find(v => v.name === villageName);

    const template = JSON.parse(localStorage.getItem(templateName));

    if (village?.status === "LOCATED" && template) {
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

async function deleteTemplate() {
    const templateName = $("#existing_templates").val();

    if (templateName) {
        try {
            await fetch(`/api/templates/${templateName}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            alert("Template deleted successfully");
        } catch (error) {
            alert("Something went wrong");
        }
    } else {
        alert("Choose template first");
    }
}

async function deleteVillage() {
    const villageName = $("#village_dropdown").val();

    if (villageName) {
        try {
            await fetch(`/api/villages/${villageName}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            alert("Village deleted successfully");
        } catch (error) {
            alert("Something went wrong");
        }
    } else {
        alert("Choose village first");
    }
}

export { fetchTemplates, fetchVillages, applyTemplate, createVillage, saveTemplate, deleteTemplate, deleteVillage }