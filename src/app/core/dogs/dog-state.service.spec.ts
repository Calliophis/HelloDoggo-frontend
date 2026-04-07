import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { DogStateService } from './dog-state.service';
import { DogApiService } from './dog-api.service';
import { Dog } from './dog.model';

describe('DogStateService', () => {
  let service: DogStateService;
  let apiServiceSpy: jasmine.SpyObj<DogApiService>;

  const mockDog: Dog = {
    id: 'dog-1',
    name: 'Fluffer',
    breed: 'Golden Retriever',
    sex: 'male',
    description: 'A good boy',
    imgUrl: 'http://example.com/dog.jpg'
  };

  beforeEach(() => {
    apiServiceSpy = jasmine.createSpyObj('DogApiService', ['getAllDogs']);
    apiServiceSpy.getAllDogs.and.returnValue(of({ dogs: [mockDog], totalDogs: 1 }));

    TestBed.configureTestingModule({
      providers: [
        DogStateService,
        { provide: DogApiService, useValue: apiServiceSpy }
      ]
    });

    service = TestBed.inject(DogStateService);
  });

  it('should initialize dogs list', () => {
    service.initDogs().subscribe();

    expect(apiServiceSpy.getAllDogs).toHaveBeenCalled();
    expect(service.dogs().length).toBe(1);
    expect(service.dogs()[0].name).toBe('Fluffer');
  });

  it('should append dogs when loading more (Pagination)', () => {
    // 1. Initial Load
    service.initDogs().subscribe();
    
    // 2. Mock a second page
    const secondDog: Dog = { ...mockDog, id: 'dog-2', name: 'Buddy' };
    apiServiceSpy.getAllDogs.and.returnValue(of({ dogs: [secondDog], totalDogs: 2 }));
    
    // 3. Load More
    service.loadMoreDogs().subscribe();

    // Assert: We should have 2 dogs now, not just the last one
    expect(service.dogs().length).toBe(2);
    expect(service.dogs()[1].name).toBe('Buddy');
  });
});
