
let product = {}
product.productdetail = ($, asin) => {
    let data = {}
    try {

        if ($('#productTitle').length > 0) {
            let imageList = {
                thumbImage: [],
                ImageLarge: []
            }
            data.category = $('#wayfinding-breadcrumbs_feature_div > ul > li:nth-child(1) > span > a').text().trim()
            try {
                data.ratting = $(".a-icon-alt")[0].firstChild.data
            } catch (error) {
                
            }
            
            data.name = $('#productTitle').text().trim()
            data.price = "0"
            data.shipping = "0"
            data.asin = ""
            let image = $('#altImages img');
            if (image.length > 0) {
                if (image.length == 1) {
                    if (!image[0].attribs.src.includes(".gif")) {
                        imageList.thumbImage.push(image[0].attribs.src)
                        let sub = image[0].attribs.src.substring(image[0].attribs.src.indexOf("._S"), image[0].attribs.src.indexOf("_."))
                        imageList.ImageLarge.push(image[0].attribs.src.replace(sub, "._SS400"))
                    }

                }
                else {
                    for (let i = 0; i < image.length; i++) {
                        if (!image[i].attribs.src.includes(".gif")) {
                            imageList.thumbImage.push(image[i].attribs.src)
                            let sub = image[i].attribs.src.substring(image[i].attribs.src.indexOf("._S"), image[i].attribs.src.indexOf("_."))
                            imageList.ImageLarge.push(image[i].attribs.src.replace(sub, "._SS400"))
                        }

                    }
                }
            }
            data.imageList = imageList;
            let weighItem = "";
            let shippingItem = "";

            if ($('tr').length > 0) {
                for (let item = 0; item < $('tr').length; item++) {
                    let node = $('tr')[item].children
                    if (node.length > 0) {
                        let itemWeight1 = 0
                        let itemship = 0
                        for (let j = 0; j < node.length; j++) {
                            try {
                                if (node[j].type == "tag") {
                                    if (itemWeight1 == 1) {
                                        weighItem = node[j].firstChild.data.trim()
                                        itemWeight1 = 0
                                    }
                                    if (itemship == 1) {
                                        shippingItem = node[j].firstChild.data.trim()
                                        itemship = 0
                                    }
                                    if (node[j].firstChild !== null && node[j].firstChild.data !== null && node[j].firstChild.data !== undefined) {
                                        if (node[j].firstChild.data.trim().includes("Item Weight")) {
                                            itemWeight1 = 1;
                                        }
                                        if (node[j].firstChild.data.trim().includes("Shipping Weight")) {
                                            itemship = 1;
                                        }
                                    }


                                }
                            } catch (error) {
                                console.log(asin + " :" + "productdetail:1:" + error)
                                itemWeight1 = 0;
                                itemship = 0;
                            }


                        }
                    }

                }
                if (weighItem != "" || shippingItem != "") {
                    data.weighItem = weighItem
                    data.shippingItem = shippingItem
                    return data
                }
            }
            if ($('ul li span.a-list-item').length > 0) {
                for (let item = 0; item < $('ul li span.a-list-item').length; item++) {
                    let node = $('ul li span.a-list-item')[item].children
                    if (node.length > 0) {
                        let itemWeight1 = 0
                        let itemship = 0
                        for (let j = 0; j < node.length; j++) {
                            try {
                                if (node[j].type == "tag") {
                                    if (itemWeight1 == 1) {
                                        weighItem = node[j].firstChild.data.trim()
                                        itemWeight1 = 0
                                    }
                                    if (itemship == 1) {
                                        shippingItem = node[j].firstChild.data.trim()
                                        itemship = 0
                                    }
                                    if (node[j].firstChild !== null && node[j].firstChild.data !== null && node[j].firstChild.data !== undefined) {
                                        if (node[j].firstChild.data.trim().includes("Item Weight")) {
                                            itemWeight1 = 1;
                                        }
                                        if (node[j].firstChild.data.trim().includes("Shipping Weight")) {
                                            itemship = 1;
                                        }
                                    }


                                }
                            } catch (error) {
                                console.log(asin + " :" + "productdetail:2:" + error)
                                itemWeight1 = 0;
                                itemship = 0;
                            }


                        }
                    }

                }
                if (weighItem != "" || shippingItem != "") {
                    data.weighItem = weighItem
                    data.shippingItem = shippingItem
                    return data
                }
            }

            if ($('ul li').length > 0) {
                for (let item = 0; item < $('ul li').length; item++) {
                    let node = $('ul li')[item].children
                    if (node.length > 0) {
                        let itemWeight1 = 0
                        let itemship = 0
                        for (let j = 0; j < node.length; j++) {
                            try {

                                if (itemWeight1 == 1) {
                                    weighItem = node[j].data.trim()
                                    itemWeight1 = 0
                                }
                                if (itemship == 1) {
                                    shippingItem = node[j].data.trim()
                                    itemship = 0
                                }
                                if (node[j].firstChild !== null && node[j].firstChild.data !== null && node[j].firstChild.data !== undefined) {
                                    if (node[j].firstChild.data.trim().includes("Item Weight")) {
                                        itemWeight1 = 1;
                                    }
                                    if (node[j].firstChild.data.trim().includes("Shipping Weight")) {
                                        itemship = 1;
                                    }
                                }
                            } catch (error) {
                                console.log(asin + " :" + "productdetail:3:" + error)
                                itemWeight1 = 0;
                                itemship = 0;
                            }





                        }
                    }

                }
                if (weighItem != "" || shippingItem != "") {
                    data.weighItem = weighItem
                    data.shippingItem = shippingItem
                    return data
                }
            }
        }

    } catch (error) {
        console.log("productdetail: " + error)
        return data;
    }
    return data;

}


product.productseller = ($, asin) => {

    let seller = $('.a-row.a-spacing-mini.olpOffer')
    let dataMin = {}
    let data = []
    try {
        if (seller.length > 0) {

            for (let i = 0; i < seller.length; i++) {
                try {
                    let sellerPr = {}
                    if ($('.a-row.a-spacing-mini.olpOffer')[i].children[3].children[1].children[1].firstChild.data.trim() == "New") {
                        sellerPr.price = $('.a-row.a-spacing-mini.olpOffer')[i].children[1].children[1].firstChild.data.trim()
                        sellerPr.price = sellerPr.price.replace("$", "")
                        sellerPr.shipping = "0";
                        if ($('.a-row.a-spacing-mini.olpOffer')[i].children[1].children.length <= 5) {

                            try {
                                sellerPr.shipping = $('.a-row.a-spacing-mini.olpOffer')[i].children[1].children[3].children[1].children[1].firstChild.data.trim()
                                if (sellerPr.shipping == "FREE Shipping") {
                                    sellerPr.shipping = "0"
                                }
                                else {
                                    sellerPr.shipping = sellerPr.shipping.replace("$", "")
                                }
                            } catch (error) {
                                console.log("SllerPr.shipping: 1 : " + error)
                            }

                            data.push(sellerPr)
                        }
                        else if ($('.a-row.a-spacing-mini.olpOffer')[i].children[1].children.length <= 7) {

                            try {
                                sellerPr.shipping = $('.a-row.a-spacing-mini.olpOffer')[i].children[1].children[5].children[1].children[1].firstChild.data.trim()
                                if (sellerPr.shipping == "FREE Shipping") {
                                    sellerPr.shipping = "0"
                                }
                                else {
                                    sellerPr.shipping = sellerPr.shipping.replace("$", "")
                                }

                            } catch (error) {
                                console.log("SllerPr.shipping: 2 : " + error)
                            }
                            data.push(sellerPr)

                        }
                        else {

                            try {
                                sellerPr.shipping = $('.a-row.a-spacing-mini.olpOffer')[i].children[1].children[7].children[1].children[1].firstChild.data.trim()
                                if (sellerPr.shipping == "FREE Shipping") {
                                    sellerPr.shipping = "0"
                                }
                                else {
                                    sellerPr.shipping = sellerPr.shipping.replace("$", "")
                                }
                            } catch (error) {
                                console.log("SllerPr.shipping: 3 : " + error)
                            }

                            data.push(sellerPr)
                        }

                    }
                } catch (error) {
                    console.log("sellerPr: " + error)
                }


            }

            if (data.length > 0) {
                let min = Number(data[0].price) + Number(data[0].shipping)
                dataMin.price = data[0].price
                dataMin.shipping = data[0].shipping
                for (let i = 1; i < data.length; i++) {
                    if (min > (Number(data[i].price) + Number(data[i].shipping))) {
                        min = Number(data[i].price) + Number(data[i].shipping)
                        dataMin.price = data[i].price
                        dataMin.shipping = data[i].shipping
                    }
                }
                return dataMin
            }

        }
    } catch (error) {
        console.log("productseller: " + seller)
    }

    return dataMin;

}

module.exports = product