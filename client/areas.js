let areasArr = []

//Modal functions
window.addEventListener("load", function () {
    let modal = document.getElementById('modal');
    let noAreas = document.getElementById('no-areas');
    document.getElementById('area-modal-btn').addEventListener('click', (e) => {
        modal.style.display = "block";
    })
    document.getElementsByClassName("close-modal-btn")[0].addEventListener('click', () => {
        modal.style.display = "none";
    });
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    function closeModal(){
        modal.style.display = "none";
    }

    //add area functionality
    let addAreaModalButton = document.getElementById('add-area-btn').addEventListener('click', (e) => {
        //prevent page refresh
        e.preventDefault();

        formData = new FormData(this.document.getElementById('add-area-form'))
        const areaName = formData.get('area-name')
        const swX = formData.get('sw-x');
        const swY = formData.get('sw-y');
        const neX = formData.get('ne-x');
        const neY = formData.get('ne-y');
        const seX = swX;
        const seY = neY;
        const nwX = neX;
        const nwY = swY;
        const focusCheck = formData.get('center-map-check')
        console.log(swX)
        console.log(swY)
        console.log(neX)
        console.log(neY)
        console.log(focusCheck)

        sw = {X: swX, Y: swY}
        se = {X: seX, Y: seY}
        ne = {X: neX, Y: neY}
        nw = {X: nwX, Y: nwY}
        coordinates = {sw, se, ne, nw}

        if (areaAlreadyExists(coordinates)) {
            this.alert("This Area already exists on the map!")
            return;
        }

        // let area = drawArea(sw, se, nw, ne, areaName)
        let area = drawArea(coordinates, areaName)
        console.log(area)
        areasArr.push(area);

        if (focusCheck){
            console.log(area.center);
            focusMapOnArea(area.center);
        }

        let areaContainer = this.document.getElementById('area-container')
        areaContainer.appendChild(createAreaCard(area));

        checkForNoAreas();
        closeModal();

        //loadSearchBox();
    })

    function createAreaCard(area){
        //let area = areasArr[areaIndex];

        let divArea = createElement('div', 'area');
        let areaNameParagraph = createElement('p', null, area.name); 
        let swCoordinatesParagraph = createElement('p', null, `SW: (${area.coordinates.sw.X}, ${area.coordinates.sw.Y})`); 
        let neCoordinatesParagraph = createElement('p', null, `NE: (${area.coordinates.ne.X}, ${area.coordinates.ne.Y})`); 
        let goToButton = createElement('button');
        goToButton.appendChild(document.createTextNode('Go To Area')) ;
        let deleteButton = createElement('button');
        deleteButton.appendChild(document.createTextNode('Delete')) ;
        // let areaIndexHiddenInput = createElement('input', null, null, areaIndex);
        // areaIndexHiddenInput.setAttribute("hidden", "");

        divArea.appendChild(areaNameParagraph);
        divArea.appendChild(swCoordinatesParagraph);
        divArea.appendChild(neCoordinatesParagraph);
        divArea.appendChild(goToButton);
        divArea.appendChild(deleteButton);

        deleteButton.addEventListener('click', (e) => onAreaDelete(e, area))
        goToButton.addEventListener('click', (e) => onGoToArea(e, area))

        return divArea;
    }

    function onAreaDelete(e, area){
        let confirmed = confirm("Are you sure you want to delete this area?")
        if(!confirmed){
            return;
        }
        //delete DOM element
        e.target.parentNode.remove();
        //delete area from map
        deleteArea(area.area)
        //remove area object from the array
        areasArr = areasArr.filter(item => item!=area);
        checkForNoAreas();
        console.log(areasArr)
    }
    function onGoToArea(e, area){
        //let areaIndex = e.parent.getElementsByTagName('input')[0].value
        focusMapOnArea(area.center);
    }
    function checkForNoAreas(){
        if (areasArr.length>0){
            noAreas.style.display = 'none';
        } else {
            noAreas.style.display = 'block';
        }
    }
    function areaAlreadyExists(coordinates) {
        let equal = false;
        areasArr.forEach(a => {
            //terrible way for deep object comparsion... find better one
            if (a.coordinates.sw.X == coordinates.sw.X && a.coordinates.sw.Y == coordinates.sw.Y && a.coordinates.ne.X == coordinates.ne.X 
                && a.coordinates.ne.Y == coordinates.ne.Y) {
                equal = true;
            }
        })
        return equal;
    }
});