async function saveTemplate() {

    const isConfirmed = confirm("Are you sure?");

    if (isConfirmed) {

        const template = getTemplate();

        console.log(template);
        if(!template && !template.cells) {
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
    const templateName =  localStorage.getItem("activeTemplate");
    return JSON.parse(localStorage.getItem(templateName));
}