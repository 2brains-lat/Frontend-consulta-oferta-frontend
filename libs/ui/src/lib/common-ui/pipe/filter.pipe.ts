import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'appFilter', standalone: true })
export class FilterPipe implements PipeTransform {
  /**
   * Pipe filters the list of elements based on the search text provided
   *
   * @param items list of elements to search in
   * @param searchText search string
   * @returns list of elements filtered by search text or []
   */
  transform(
    items: { label: string; value: string }[],
    searchText: string
  ): any[] {
    console.log('FilterPipe.transform : ', items, searchText);

    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLocaleLowerCase();

    return items.filter((it) => {
      return it.label.toLocaleLowerCase().includes(searchText);
    });
  }
}
