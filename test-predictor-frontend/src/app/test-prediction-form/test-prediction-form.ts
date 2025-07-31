//import { Component } from '@angular/core';

//@Component({
 // selector: 'app-test-prediction-form',
 // imports: [],
 // templateUrl: './test-prediction-form.html',
 // styleUrl: './test-prediction-form.css'
//})
//export class TestPredictionForm {

//}




import { Component, OnInit } from '@angular/core';
//import { PredictionService } from '../prediction.service';
import { TestPrediction } from '../test-prediction';

@Component({
  selector: 'app-test-prediction-form',
  templateUrl: './test-prediction-form.html',
  styleUrls: ['./test-prediction-form.css']
})
export class TestPredictionForm implements OnInit {
  prediction = {
    name: '',
    email: '',
    teams: Array(20).fill('') // Initialize an array of 20 empty strings for teams
  };
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isSubmitting = false;

  constructor(private predictionService: TestPrediction) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.successMessage = null; // Clear previous messages
    this.errorMessage = null;
    this.isSubmitting = true;

    // Client-side validation for duplicate teams (optional but good UX)
    const uniqueTeams = new Set(this.prediction.teams.filter(team => team.trim() !== ''));
    if (uniqueTeams.size !== this.prediction.teams.filter(team => team.trim() !== '').length) {
        this.errorMessage = 'Please ensure all team entries are unique.';
        this.isSubmitting = false;
        return;
    }

    this.predictionService.submitPrediction(this.prediction).subscribe({
      next: (response) => {
        this.successMessage = response.success_message || 'Prediction submitted successfully!';
        this.errorMessage = response.error_message || null; // Check for backend error messages
        this.resetForm(); // Reset form after successful submission
      },
      error: (error) => {
        console.error('Error submitting prediction:', error);
        this.errorMessage = error.error?.error_message || 'Failed to submit prediction. Please try again.';
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }

  resetForm(): void {
    this.prediction = {
      name: '',
      email: '',
      teams: Array(20).fill('')
    };
  }
}
