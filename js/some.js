const savedTheme = window.localStorage.getItem('theme')

window.onload = () => {
    //    appy theme

    if (savedTheme == 'light')
    {
        document.body.classList.remove("dark");
        document.body.classList.add("light");



        let toggle = document.getElementById("theme-toggle");

        toggle.innerHTML = "light_mode";

        window.localStorage.setItem('theme', 'light')

    } else if (savedTheme == 'dark')
    {

        document.body.classList.remove("light");
        document.body.classList.add("dark");

        let toggle = document.getElementById("theme-toggle");

        toggle.innerHTML = "dark_mode";
        window.localStorage.setItem('theme', 'dark')
    }

}

function toggleTheme() {
    if (document.body.classList.contains("dark"))
    {
        document.body.classList.remove("dark");
        document.body.classList.add("light");



        let toggle = document.getElementById("theme-toggle");

        toggle.innerHTML = "light_mode";

        window.localStorage.setItem('theme', 'light')

    } else if (document.body.classList.contains("light"))
    {

        document.body.classList.remove("light");
        document.body.classList.add("dark");

        let toggle = document.getElementById("theme-toggle");

        toggle.innerHTML = "dark_mode";
        window.localStorage.setItem('theme', 'dark')
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
            children[children.length - 1].style = ''
        }
    })


}