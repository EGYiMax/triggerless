import Avatar from "./Avatar"
import Room from "./Room"
import { useState } from 'react'
import './Outfits.css'

const Outfits = () => {

    const [state, setState] = useState({avatars: [], room: []})

    const clearLink = () => {
        document.getElementById("webLink").value = ''
        setState({avatars: [], room: []})
    }

    const processLink = () => {
        let webLink = document.getElementById("webLink").value
        let linkData = getLinkData(webLink)
        let newState = {avatars: [], room: []}
        
        if (linkData.avatars == null || linkData.avatars.length === 0) {
            setState({...newState})
            return;
        }
        setState(newState);
        console.log(state);
        let remoteServer = 'https://triggerless.com/api'  // production
        let localServer = 'http://localhost:61120/api'  // development
        let server = remoteServer

        // Loop through avatars and get all their products

        const getAvis = (server, linkData) => linkData.avatars.forEach(avi => {
            fetch(`${server}/user/${avi.id}`)
            .then(res => res.json())
            .then(data => {
                let currentUser = data
                let queryString = 'p=' + avi.products.join('&p=')
                fetch(`${server}/products?${queryString}`)
                .then(res => res.json())
                .then(data => {
                    currentUser.products = data.Products.filter(p => p.product_name != null)
                    console.log(currentUser)
                    newState = {...state, avatars: [...state.avatars, currentUser]}
                    setState(newState);
                    console.log('newState', newState)
                });
            })
        });       
        getAvis(server, linkData); 

        // Get the room products first
        const getRoom = (server, linkData) => {
            let qs = 'p=' + linkData.room.join('&p=')
            fetch(`${server}/products?${qs}`)
                .then(res => res.json())
                .then(data => {
                    let roomProds = data.Products.filter(p => p.product_name != null)
                    newState = {...state, room: roomProds}
                    setState(newState);
                    console.log('newState', state);
                }
            );
        }
        getRoom(server, linkData)
        const promise = new Promise((resolve, reject) => {

        });


    }

    return (
        <>
        <div>How to use this...</div>
        <ol>
            <li>In IMVU Client, right-click anywhere in the room, and select "View products in this scene".</li>
            <li>Your browser should pop up with a page. Usually, many of the outfits will be hidden.</li>
            <li>Go to the Address Bar near the top, and select the entire web link. Copy it to the clipboard.</li>
            <li>Paste the web link into the text box below. Click "Expose" button. After a brief wait, the outfits will be exposed.</li>
        </ol>
        <table>
            <tbody>
            <tr>
                <td>
                <div style={{paddingLeft: "25px"}}>
                    <textarea id="webLink" style={{width: "500px", height: "200px"}} placeholder="Paste web link here"></textarea>
                </div>
                </td>
                <td>
                <div><button className="outfits-btn" onClick={processLink}>Expose</button></div>
                <div><button className="outfits-btn" onClick={clearLink}>Clear</button></div>
                </td>
            </tr>
            <tr>
                <td colSpan="2" style={{fontSize: "0.8em"}}>Please note: This will only work on browsers released later than 2015.<br/>If your browser is older, this isn't guaranteed to work.</td>
            </tr>
            </tbody>
        </table>
        <div>
            {state.avatars.map((avi) => (
                <Avatar key={avi.id} avatar={avi} />
            ))}
            <Room products={state.room} />
        </div>
        </>
    )
}

const getLinkData = (url) => {
    let linkData = {
        status: 'failure',
        message: 'Sorry, that link won\'t work. Please try again.'
    }

    url = url.replace('\n', '').replace(' ') // remove all whitespace

    //snip1 URL and query string

    let snipQS = str.split('?')
    if (snipQS.length !== 2) return linkData

    // snip2 query parameters

    let queryString = snipQS[1]
    let snipNameVales = queryString.split('&')
    if (snipNameVales.length < 2) return linkData // at least avatar and room should be available

    linkData.avatars = []
    linkData.room = []

    for (let i = 0; i < snipNameVales.length; i++) {
        let nameValue = snipNameVales[i]
        let snipNV = nameValue.split('=')
        if (snipNV.length !== 2) continue

        let name = snipNV[0]
        let value = snipNV[1]
        if (name.indexOf('avatar') === 0) {
            linkData.avatars.push({
                id: name.replace('avatar', ''),
                products: value.split('%3B')
            })
        } else if (snip3[0] === 'room') {
            linkData.room = value.split('%3B').map(p => p.split('x')[0])
        } else continue
    }

    linkData.status = 'success'
    linkData.message = `Decoded room and ${linkData.avatars.length} avatars.`
    return linkData

}
export default Outfits
