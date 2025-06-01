import { getChannels } from "./clatterAPI.js"
import ClientConfig from "../scripts/ClientConfig.js"

var updatechannelList = async function() {
    var channels = await getChannels()
    document.getElementById("channels").querySelector(".sidebar-section-content").innerHTML = ``
    channels.forEach(channel => {
        var item = document.createElement("clatter-sidebar-item")
        item.setAttribute("type", "channel")
        item.setAttribute("channeltitle", channel.name)
        item.addEventListener("click", () => {
            window.history.pushState(null, null, "/starship/channel/" + channel.id)
            updateViewLocation()
        })
        document.getElementById("channels").querySelector(".sidebar-section-content").appendChild(item)
    })
}

var drawMainNav = function() {
    ClientConfig.mainNavigation.forEach(item => {
        var navigationitem = document.createElement("clatter-sidebar-item")
        navigationitem.setAttribute("type", "customicon")
        navigationitem.setAttribute("icon", item.icon)
        navigationitem.setAttribute("channeltitle", item.title)
        navigationitem.addEventListener("click", () => {
            window.history.pushState(null, null, item.path)
            updateViewLocation()
        })
        document.getElementById("main-navigation").appendChild(navigationitem)
    })
}

window.loadfunction = async function() {
    var org = await authClient.organization.getFullOrganization()
    if(org.data == undefined) {
        var orglist = await authClient.organization.list()
        if(orglist.data.length == 0) {
            window.location.pathname = "/authui/createworkspace.html?callback=/starship/"
        }
        await authClient.organization.setActive({organizationId: orglist.data[0].id})
        org = await authClient.organization.getFullOrganization()
    }
    $(".sidebar-workspace-text").text(org.data.name)
    $(".sidebar-workspace-icon").attr("src", org.data.logo)
    updatechannelList()
    updateViewLocation()
    document.getElementById("mainarea").addEventListener("click", () => {
        if(innerWidth < 768) {
            document.getElementById("sidebar").setAttribute("closed", "true")
            document.getElementById("mainarea").style.opacity = 1
        }
    })
    var workspacelist = await authClient.organization.list()
    var workspaceswitcherlist = ""
    workspacelist.data.forEach(workspace => {
        if(workspace.id == org.data.id) {
            var active = "true"
        } else {
            var active = "false"
        }
        workspaceswitcherlist += `
            <clatter-sidebar-item type="imageicon" active="` + active + `" icon="` + workspace.logo + `" channeltitle="` + workspace.name + `" onclick="window.switchWorkspace('` + workspace.id + `')"></clatter-sidebar-item>
        `
    })
    window.wsswitchertippy = tippy('.workspace-switcher', {
        content: `
            ` + workspaceswitcherlist + `
            <clatter-sidebar-seperator></clatter-sidebar-seperator>
            <clatter-sidebar-item type="customicon" icon="plus" id="create-workspace-button" channeltitle="Create Workspace" onclick="window.location.href = '/authui/createworkspace.html?callback=/starship/'"></clatter-sidebar-item>
            <clatter-sidebar-item type="customicon" icon="settings" id="user-settings-button" channeltitle="User Settings" onclick="window.history.pushState(null, null, '/starship/usersettings'); window.updateViewLocation(); window.wsswitchertippy[0].hide()"></clatter-sidebar-item>
            <clatter-sidebar-item type="customicon" icon="log-out" id="sign-out-button" channeltitle="Sign out" onclick="authClient.signOut().then(() => {window.location.reload()})"></clatter-sidebar-item>
        `,
        trigger: 'click',
        placement: 'bottom',
        arrow: false,
        interactive: true,
        allowHTML: true,
        theme: 'workspace-switcher',
        animation: 'shift-away-subtle',
    });
    $("#sidebar").show()
    $("#mainarea").show()
}

window.onload = function() {
    drawMainNav()
}

var updateViewLocation = function() {
    var url = window.location.pathname
    var urlsplit = url.split("/")
    try {
        window.currentChat.socket.off()
    } catch {
        
    }
    if(urlsplit[2] == "") {
        $("#mainview").load("/starship/pages/channels.html")
    } else {
        $("#mainview").load("/starship/pages/" + urlsplit[2] + ".html")
    }
    if(innerWidth < 768) {
        document.getElementById("sidebar").setAttribute("closed", "true")
        document.getElementById("mainarea").style.opacity = 1
    }
}

window.switchWorkspace = async function(id) {
    await authClient.organization.setActive({organizationId: id})
    var org = await authClient.organization.getFullOrganization()
    $(".sidebar-workspace-text").text(org.data.name)
    $(".sidebar-workspace-icon").attr("src", org.data.logo)
    window.history.pushState(null, null, "/starship/")
    updateViewLocation()
    updatechannelList()
    window.wsswitchertippy[0].destroy()
    var workspacelist = await authClient.organization.list()
    var workspaceswitcherlist = ""
    workspacelist.data.forEach(workspace => {
        if(workspace.id == org.data.id) {
            var active = "true"
        } else {
            var active = "false"
        }
        workspaceswitcherlist += `
            <clatter-sidebar-item type="imageicon" active="` + active + `" icon="` + workspace.logo + `" channeltitle="` + workspace.name + `" onclick="window.switchWorkspace('` + workspace.id + `')"></clatter-sidebar-item>
        `
    })
    window.wsswitchertippy = tippy('.workspace-switcher', {
        content: `
            ` + workspaceswitcherlist + `
            <clatter-sidebar-seperator></clatter-sidebar-seperator>
            <clatter-sidebar-item type="customicon" icon="plus" id="create-workspace-button" channeltitle="Create Workspace" onclick="window.location.href = '/authui/createworkspace.html?callback=/starship/'"></clatter-sidebar-item>
            <clatter-sidebar-item type="customicon" icon="settings" id="user-settings-button" channeltitle="User Settings" onclick="window.history.pushState(null, null, '/starship/usersettings'); window.updateViewLocation(); window.wsswitchertippy[0].hide()"></clatter-sidebar-item>
            <clatter-sidebar-item type="customicon" icon="log-out" id="sign-out-button" channeltitle="Sign out" onclick="authClient.logout().then(() => {window.location.reload()})"></clatter-sidebar-item>
        `,
        trigger: 'click',
        placement: 'bottom',
        arrow: false,
        interactive: true,
        allowHTML: true,
        theme: 'workspace-switcher',
        animation: 'shift-away-subtle',
    });
}

window.addEventListener('popstate', function (event) {
    updateViewLocation()
});


window.updateChannelList = updatechannelList
window.updateViewLocation = updateViewLocation
