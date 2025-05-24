import { NestFactory } from '@nestjs/core';
import { SeederModule } from './seeder.module';
import { Logger } from '@nestjs/common';
import { ProductSeeder } from './product.seeder';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(SeederModule);
  const logger = new Logger('Seeder');
  try {
    const productSeeder = appContext.get(ProductSeeder);
    await productSeeder.seed();
    logger.log('Seeder ejecutado con éxito.');
  } catch (error) {
    logger.error('Error al ejecutar el seeder:', error);
  } finally {
    await appContext.close();
  }
}

bootstrap();
