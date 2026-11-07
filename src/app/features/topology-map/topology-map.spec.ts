import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TopologyMap } from './topology-map';

describe('TopologyMap', () => {
  let component: TopologyMap;
  let fixture: ComponentFixture<TopologyMap>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopologyMap],
    }).compileComponents();

    fixture = TestBed.createComponent(TopologyMap);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
