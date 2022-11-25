import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'booleanTexto'
})
export class BooleanTextoPipe implements PipeTransform {

  transform(value: boolean, ...args: string[]): string {
    console.log(value);
    console.log(args);
    if(!value){
      return args[1]
    }else {
      return args[0]
    }
  }

}
