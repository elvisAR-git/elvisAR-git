function toggleTheme() {
    if (document.body.classList.contains("dark"))
    {
        document.body.classList.remove("dark");
        document.body.classList.add("light");



        let toggle = document.getElementById("theme-toggle");

        toggle.innerHTML = "light_mode";

    } else
    {

        document.body.classList.remove("light");
        document.body.classList.add("dark");

        let toggle = document.getElementById("theme-toggle");

        toggle.innerHTML = "dark_mode";
    }

}


function showMore(event) {
    let parent = event.target.parentElement.parentElement

    let moreElements = Array.from(parent.children).filter(elem => {
        if (elem.className == 'more') return elem
    })

    moreElements.forEach(e => {
        e.classList.remove('more')
    });
    event.target.style = 'display:none'
}


function hideMore(event) {
    let parent = event.target.parentElement.parentElement
    let outerParent = event.target.parentElement.parentElement.parentElement;

    parent.classList.add('more')


    Array.from(outerParent.children).filter(elem => {
        if (elem.className == 'desc')
        {
            let children = Array.from(elem.children)
            let showCtrl = children[children.length - 1]
            return showCtrl.style = ''
        }
    })


}