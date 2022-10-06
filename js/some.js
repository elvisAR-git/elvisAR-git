const savedTheme = window.localStorage.getItem('theme')
const themeConfig = window.localStorage.getItem('theme-setting')
window.onload = () => {

    if (themeConfig == undefined)
    {
        window.localStorage.setItem('theme-setting', 'auto')
    }

    if (themeConfig != 'auto')
    {
        let menu = document.getElementById('theme-options')

        Array.from(menu.children).forEach(e => {
            e.classList.remove('active')
            e.classList.remove('inactive')
        })

        if (savedTheme == 'dark')
        {
            document.body.classList.remove("light");
            document.body.classList.add("dark");
            let toggle = document.getElementById("theme-toggle");
            toggle.innerHTML = "dark_mode";
            window.localStorage.setItem('theme', 'dark')
            window.localStorage.setItem('theme-setting', 'dark')

            Array.from(menu.children).forEach(e => {
                if (e.id == 'dark')
                {
                    e.classList.add('active')
                } else
                {
                    e.classList.add('inactive')
                }
            })
        } else if (savedTheme == 'light')
        {

            document.body.classList.remove("dark");
            document.body.classList.add("light");
            let toggle = document.getElementById("theme-toggle");
            toggle.innerHTML = "light_mode";
            window.localStorage.setItem('theme', 'light')
            window.localStorage.setItem('theme-setting', 'light')


            Array.from(menu.children).forEach(e => {
                if (e.id == 'light')
                {
                    e.classList.add('active')
                } else
                {
                    e.classList.add('inactive')
                }
            })
        }
    }

    // on outside click

    document.addEventListener('click', function (event) {

        let isClickInside = document.getElementById('theme-toggle').contains(event.target) || document.getElementById('dark').contains(event.target) || document.getElementById('light').contains(event.target) || document.getElementById('default').contains(event.target)

        if (!isClickInside)
        {
            let menu = document.getElementById('theme-options')
            menu.style.display = 'none'
        }
    })

    themeChecker()

}


function toggleThemeMenu() {
    let menu = document.getElementById('theme-options')
    if (menu.style.display == 'none' || menu.style.display == '')
    {
        menu.style.display = 'block'
    } else
    {
        menu.style.display = 'none'
    }
}




function setTheme(mode) {

    if (mode == 'auto')
    {
        window.localStorage.setItem('theme-setting', 'auto')
        return themeChecker()
    } else
    {
        window.localStorage.setItem('theme-setting', 'manual')

        if (mode == 'dark')
        {
            document.body.classList.remove("light");
            document.body.classList.add("dark");
            let toggle = document.getElementById("theme-toggle");
            toggle.innerHTML = "dark_mode";
            window.localStorage.setItem('theme', 'dark')
            window.localStorage.setItem('theme-setting', 'dark')
        } else
        {
            document.body.classList.remove("dark");
            document.body.classList.add("light");
            let toggle = document.getElementById("theme-toggle");
            toggle.innerHTML = "light_mode";
            window.localStorage.setItem('theme', 'light')
            window.localStorage.setItem('theme-setting', 'light')
        }
    }

    let menu = document.getElementById('theme-options')

    Array.from(menu.children).forEach(e => {
        e.classList.remove('active')
        e.classList.remove('inactive')
    })

    if (mode == 'dark')
    {
        Array.from(menu.children).forEach(e => {
            if (e.id == 'dark')
            {
                e.classList.add('active')
            } else
            {
                e.classList.add('inactive')
            }
        })
    } else if (mode == 'light')
    {

        Array.from(menu.children).forEach(e => {
            if (e.id == 'light')
            {
                e.classList.add('active')
            } else
            {
                e.classList.add('inactive')
            }
        })
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


function themeChecker() {
    // animation loop
    if (window.localStorage.getItem('theme-setting') != 'auto')
    {
        return;
    }

    const darkMode = window.matchMedia("(prefers-color-scheme:dark)").matches;
    const currentTheme = window.localStorage.getItem('theme')

    if (currentTheme == undefined)
    {
        // apply dark mode if user has dark mode enabled

        if (darkMode)
        {
            document.body.classList.remove("light");
            document.body.classList.add("dark");
            let toggle = document.getElementById("theme-toggle");
            toggle.innerHTML = "dark_mode";

            // save theme
            window.localStorage.setItem('theme', 'dark')

        } else
        {

            document.body.classList.remove("dark");
            document.body.classList.add("light");
            let toggle = document.getElementById("theme-toggle");
            toggle.innerHTML = "light_mode";
            window.localStorage.setItem('theme', 'light')
        }
    }

    if (darkMode)
    {
        if (Array.from(document.body.classList).includes('light'))
        {
            document.body.classList.remove("light");
            document.body.classList.add("dark");
            let toggle = document.getElementById("theme-toggle");
            toggle.innerHTML = "dark_mode";

            // save theme
            window.localStorage.setItem('theme', 'dark')
        }
    } else
    {
        if (Array.from(document.body.classList).includes('dark'))
        {
            document.body.classList.remove("dark");
            document.body.classList.add("light");
            let toggle = document.getElementById("theme-toggle");
            toggle.innerHTML = "light_mode";

            // save theme
            window.localStorage.setItem('theme', 'light')
        }

    }


    let menu = document.getElementById('theme-options')

    Array.from(menu.children).forEach(e => {

        if (e.id == 'default')
        {
            e.classList.add('active')
            e.classList.remove('inactive')
        } else
        {

            e.classList.remove('active')
            e.classList.remove('inactive')
        }

    })


    requestAnimationFrame(themeChecker);
}