import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke.response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';


@Injectable()
export class SeedService {

  constructor( 
      @InjectModel( Pokemon.name )
      private readonly pokemonModel: Model<Pokemon>,

      private readonly http: AxiosAdapter,
    ) {}
 
  async executeSeed() {

    await this.pokemonModel.deleteMany();

    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');

    const pokemons = data.results.map( ( { name, url } ) => ({
 
      name: name,
      no: +url.split('/')[6]

    } ) );

    await this.pokemonModel.insertMany(pokemons);

    return 'Seed Executed Successfuly!!';
  }

}
