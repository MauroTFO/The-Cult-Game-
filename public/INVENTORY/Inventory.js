inventory = function () {
    var self = {
        items: []
    }
    self.addItem = function (id, amount) {
        for (var i = 0; i < self.items.length; i++) {
            if (self.items[i].id === id) {
                self.items[i].amount += amount
                self.refreshRender()
                return;
            }
        }
        self.items.push({ id: id, amount: amount })
    }
    self.removeItem = function (id, amount) {
        for (var i = 0; i < self.items.length; i++) {
            if (self.items[i].id === id) {
                self.items[i].amount -= amount
                if (self.items[i] < 0)
                    self.items.splice(i, i)
                self.refreshRender()

                return;
            }
        }
    }
    self.hasItem = function (id, amount) {
        for (var i = 0; i < self.items.length; i++) {
            if (self.items[i].id === id) {
                return self.items[i].amount > - amount
            }
        }
        return false
    }
    self.refreshRender = function () {
        var str = ""
        for (var i = 0; i < self.items.length; i++) {
            let item = item.lis[self.items[i].id]
            let onclick = "item.list['" + item.id + "'].event()"
            str += "<button onclick=\"\">" + item.name + "x" + self.items[i].amount + "</button><br>"
        }
        document.getElementById("Inventory").innerHTML = "sdws"
    }

    return self

}

item = function (id, name, event) {
    var self = {
        id: id,
        name: name,
        event: event
    }
    item.list[self.id] = self
    return self
}

item.list = {}


