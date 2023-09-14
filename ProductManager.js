const fs = require ('fs')

class ProductManager{
    // correccion de path 
    constructor(path) {
        this.path = path;
    }
    // - Leer Productos -
    async getProducts(){
    try {
        if (fs.existsSync(this.path)) {
            const productsFile = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(productsFile);
    }else {
            return []; 
        }
        
    } catch (error) {
        return error
    }
    }
    async addProduct(title, description, price, thumbnail, code, stock){
        try {
            //- Verificacion basica de datos -
            if (!title || !description || isNaN(price) || isNaN(stock) || !thumbnail || !code) {
                console.error("Faltan datos del producto");
                return;
            }

            const products = await this.getProducts();
            //Correccion code repetido
            const repeatedCode = products.some((product) => product.code === code);

            if (repeatedCode) {
                console.error('Ya existe un producto con el mismo código , intentelo nuevamente');
                return;
            }
            let id;

            if (!products.length) {
                id = 1;
            } else {
                id = products[products.length - 1].id + 1;
            }

            const newProduct = {id, title, description, price, stock, thumbnail,code
            };
            products.push(newProduct);

            await fs.promises.writeFile(this.path, JSON.stringify(products));
        } catch (error) {
            return error;
        }
    }
    async getProductById(id) {
        const products = await this.getProducts();
        const product = products.find(p => p.id === id);
        if (!product) {
            console.error("Producto no encontrado");
            return null; 
         } else {
            return product;
        }
    }
    
    async updateProduct(id, updatedData) {
        try {
            const products = await this.getProducts();
            // encontrar producto 
            const productIndex = products.findIndex((p) => p.id === id);
            if (productIndex === -1) {
                console.error('Producto no encontrado');
                return;
            }
        // Actualizar producto 
           const updatedProduct = { ...products[productIndex], ...updatedData };
            products[productIndex] = updatedProduct;
    
             await fs.promises.writeFile(this.path, JSON.stringify(products));
            console.log('Producto se ha actualizado correctamente');
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
        }
    }
    
    async deleteProduct(id){
        try {
            // Leer lista actual 
            const products = await this.getProducts()
            // Filtrar para eliminar el producto del id proporcionado 
            const updatedProduct = products.filter(p=>p.id!==id)
            // Escribir lista de productos actualizada
            await fs.promises.writeFile(this.path ,JSON.stringify(updatedProduct))
        } catch (error) {
            return error
        }
    }
}

async function testProductManager() {
    const productManager = new ProductManager('Products.JSON');

    try {
        // Función addProduct
        await productManager.addProduct(
            'Producto 1', 'Descripción del producto 1', 15,'img',
            '#1',10
        );
        await productManager.addProduct(
            'Producto 2', 'Producto a eliminar', 14,'img',
            '#2',15
        );
        await productManager.addProduct(
            'Producto 3', 'Codigo Repetido', 17,'img',
            '#2',16
        );
        await productManager.addProduct(
            'Producto 4', 'Descripción del producto 4', 18,'img',
            '#3',18
        );

        // Funcion para actualizar producto
        const IdToUpdate = 1;
        const updatedData = {
            title: 'Producto 1 Actualizado',
            description: 'Nueva descripción',
            price: 20,
            stock: 5,
        };
        await productManager.updateProduct(IdToUpdate, updatedData)
        
        // Borrar un producto
        const productIdToDelete = 2;
        await productManager.deleteProduct(productIdToDelete);

        // Lista de productos Actualizados
        const updatedProducts = await productManager.getProducts();
        console.log('Productos Actualizados:', updatedProducts);
    } catch (error) {
        console.error('Error', error);
    }
}

testProductManager();
