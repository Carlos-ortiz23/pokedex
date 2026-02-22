import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke.response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';

import axios, { AxiosInstance } from 'axios';


@Injectable()
export class SeedService {

  private readonly axios: AxiosInstance = axios;

  constructor( 
      @InjectModel( Pokemon.name )
      private readonly pokemonModel: Model<Pokemon> 
    ) {}
 
  async executeSeed() {

    await this.pokemonModel.deleteMany();

    const { data } = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');

    const pokemons = data.results.map( ( { name, url } ) => ({
 
      name: name,
      no: +url.split('/')[6]

    } ) );

    await this.pokemonModel.insertMany(pokemons);

    return 'Seed Executed Successfuly!!';
  }

}
