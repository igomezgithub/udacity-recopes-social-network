import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators, FormGroupDirective, NgForm } from '@angular/forms';

import { RecipeService } from '../../services/recipe.service';
import { SkillLevel } from '../../models/skill-level.enum';
import { RecipeDto } from '../../models/recipe-dto.interface';

const ALL_SKILL_LEVELS: any[] = [
  { key: SkillLevel.None, value: '' },
  { key: SkillLevel.Beginner, value: 'Beginner' },
  { key: SkillLevel.Easy, value: 'Easy' },
  { key: SkillLevel.Intermediate, value: 'Intermediate' },
  { key: SkillLevel.Experienced, value: 'Experienced' }
];

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  id: number = 0;
  editMode = false;
  recipeItemForm: FormGroup = new FormGroup({});

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.editMode = params['id'] != null;
      this.initForm();
    });
  }

  get skillLevels(): any[] {
    return ALL_SKILL_LEVELS;
  }

  onSubmit() {
    // const newRecipe = new Recipe(
    //   this.recipeForm.value['name'],
    //   this.recipeForm.value['description'],
    //   this.recipeForm.value['imagePath'],
    //   this.recipeForm.value['ingredients']);
    if (this.editMode) {
      this.recipeService.updateRecipe(this.id, this.recipeItemForm.value);
    } else {
      this.recipeService.addRecipeAndUpdateList(this.recipeItemForm.value);
    }
    this.onCancel();
  }

  // onAddIngredient() {
  //   (<FormArray>this.recipeItemForm.get('ingredients')).push(
  //     new FormGroup({
  //       name: new FormControl(null, Validators.required),
  //       amount: new FormControl(null, [
  //         Validators.required,
  //         Validators.pattern(/^[1-9]+[0-9]*$/)
  //       ])
  //     })
  //   );
  // }

  // onDeleteIngredient(index: number) {
  //   (<FormArray>this.recipeItemForm.get('ingredients')).removeAt(index);
  // }

  onCancel() {
    //this.router.navigate(['../'], { relativeTo: this.route });
  }

  private initForm() {
    let recipeName = '';
    let recipeImagePath: string | undefined = undefined;
    let readyIn: number | undefined = undefined;
    let skillLevel: SkillLevel | undefined = undefined;
    let recipeDescription = '';
    let recipeIngredients: string = '';
    let ingredientName: string = '';
    let ingredientAmount: string = '';
    let method: string = '';

    if (this.editMode) {
      const recipe = this.recipeService.getRecipe(this.id);
      recipeName = recipe.name;
      recipeImagePath = recipe.imagePath;
      readyIn = recipe.readyIn;
      skillLevel = recipe.skillLevel;
      recipeDescription = recipe.description;
      method = recipe.description;

      // if (recipe['ingredients']) {
      //   for (let ingredient of recipe.ingredients) {
      //     recipeIngredients.push(
      //       new FormGroup({
      //         name: new FormControl(ingredient.name),
      //         amount: new FormControl(ingredient.amount, [
      //           Validators.required,
      //           Validators.pattern(/^[1-9]+[0-9]*$/)
      //         ])
      //       })
      //     );
      //   }
      // }
    }

    this.recipeItemForm = new FormGroup({
      name: new FormControl(recipeName, Validators.required),
      imagePath: new FormControl(recipeImagePath),
      readyIn: new FormControl(readyIn),
      skillLevel: new FormControl(skillLevel),
      description: new FormControl(recipeDescription, Validators.required),
      ingredients: new FormControl(recipeIngredients),
      ingredientName: new FormControl(ingredientName),
      ingredientAmount: new FormControl(ingredientAmount),
      method: new FormControl(method)
    });

    //this.recipeItemForm.get('ingredients').disable();
   }

  // getIngredientsControls() {
  //   return (this.recipeItemForm.get('ingredients') as FormArray).controls;
  // }

  geRecipeNameErrorMessage() {
    if (this.recipeItemForm.controls.name.hasError('required')) {
      return 'You must enter the recipe name';
    } else {
      return null;
    }
  }

  onActivateIngredientButton(): boolean {
    return !(this.recipeItemForm.get('ingredientName')?.value !== '' && this.recipeItemForm.get('ingredientAmount')?.value !== '');
  }

  onSaveIngredientAction() {
    const previousValue: string = (this.recipeItemForm.get('ingredients')?.value === '') ? "" : this.recipeItemForm.get('ingredients')?.value;
    const nextValue =
      previousValue +
      this.recipeItemForm.get('ingredientAmount')?.value +
      " - " +
      this.recipeItemForm.get('ingredientName')?.value +
      "\n";

    this.recipeItemForm.get('ingredients')?.setValue(nextValue);
  }
}
