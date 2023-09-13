
const fs = require ('fs')
const path = 'Products.JSON'


class ProductManager{
    // - Leer Productos -
    async getProducts(){
    try {
        if(fs.existsSync(path)){
        const productsFile = await fs.promises.readFile(path , 'utf-8')
        return JSON.parse(productsFile)
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
            let id;

            if (!products.length) {
                id = 1;
            } else {
                id = products[products.length - 1].id + 1;
            }

            const newProduct = {id, title, description, price, stock, thumbnail,code
            };
            products.push(newProduct);

            await fs.promises.writeFile(path, JSON.stringify(products));
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
    
             await fs.promises.writeFile(path, JSON.stringify(products));
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
            await fs.promises.writeFile(path ,JSON.stringify(updatedProduct))
        } catch (error) {
            return error
        }
    }
}

async function testProductManager() {
    const productManager = new ProductManager();

    // Función addProduct
    await productManager.addProduct(
        'Producto 1', 'Descripción del producto 1', 15,'img',
        '#1',10
    );
    await productManager.addProduct(
        'Producto 2', 'Descripción del producto 2', 14,'img',
        '#2',11
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
}
testProductManager();
