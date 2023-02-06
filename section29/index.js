const user = {
    name: '<script />'
}

const result = `<h2>${user.name}</h2>`
const vm = require('vm');

const templateMap = {
    templateA: '`<h2>${include("templateB")}</h2>`',
    templateB: '`<p>hahahaha</p>`',
    templateC: '`<h2>${_(include("templateB"))}</h2>`',
}

//  模板运行的沙箱环境
const context = {
    // 引用子模板
    include(name) {
        return templateMap[name]()
    },
    // xss 过滤
    _: function (markup) {
        if (!markup) return '';
        return String(markup)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/'/g, '&#39;')
            .replace(/"/g, '&quot;')
    }
}

Object.keys(templateMap).forEach(key => {
    const temp = templateMap[key];

    templateMap[key] = vm.runInNewContext(`
        (function() {return ${temp}})
    `, context);
})

console.log(templateMap['templateA']());
console.log(templateMap['templateC']());

{/* <h2><p>hahahaha</p></h2> */ }
{/* <h2>&lt;p&gt;hahahaha&lt;/p&gt;</h2> */ }